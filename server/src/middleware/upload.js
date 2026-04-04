const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileType = require('file-type');

// Make sure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${req.user.id}-${uniqueSuffix}${ext}`);
  },
});

// Extension-based filter (first line of defense)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024,
  },
});

// MIME type validation (second line of defense - validates actual file content)
const validateFileMIME = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    // Read first 512 bytes for signature checking
    const buffer = Buffer.alloc(512);
    const fd = fs.openSync(req.file.path, 'r');
    const bytesRead = fs.readSync(fd, buffer, 0, 512, 0);
    fs.closeSync(fd);

    // Check for executable signatures (MZ header for .exe, .dll, etc.)
    if (buffer[0] === 0x4D && buffer[1] === 0x5A) { // "MZ"
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: 'Security risk: Executable files are not allowed.' 
      });
    }

    // Check for ELF executables (Linux)
    if (buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: 'Security risk: Executable files are not allowed.' 
      });
    }

    // Check for script files (#! shebang)
    if (buffer[0] === 0x23 && buffer[1] === 0x21) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        error: 'Security risk: Script files are not allowed.' 
      });
    }

    // Use file-type for additional validation
    const fileType = await FileType.fromFile(req.file.path);
    const ext = path.extname(req.file.originalname).toLowerCase();
    
    // If file-type returns nothing and it claims to be a PDF, it's likely a text file
    if (!fileType && ext === '.pdf') {
      // Check if it's actually a text file
      const textCheck = buffer.toString('utf8', 0, Math.min(bytesRead, 100));
      // If the content is readable ASCII text (no PDF binary markers), reject it
      if (!/[\x00-\x08\x0E-\x1F]/.test(textCheck) && !/^%PDF/.test(textCheck)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          error: 'Invalid PDF file. This appears to be a text file renamed as PDF.' 
        });
      }
    }
    
    if (fileType) {
      // Block known dangerous types
      const dangerousMimeTypes = [
        'application/x-msdownload',
        'application/x-executable',
        'application/x-msdos-program',
        'application/x-sh',
        'application/javascript',
        'text/x-shellscript',
        'application/x-python',
      ];

      if (dangerousMimeTypes.includes(fileType.mime)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          error: `Security risk: ${fileType.mime} files are not allowed.` 
        });
      }
    }

    // If we reach here, file passed all security checks
    // Extension validation already happened in fileFilter
    next();
  } catch (err) {
    console.error('MIME validation error:', err);
    
    // Clean up the file if validation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ error: 'Failed to validate file type.' });
  }
};

// Multer error handler middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 5}MB.` 
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        error: 'Unexpected field name. Use "resume" as the field name.' 
      });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // Custom errors (from fileFilter)
    return res.status(400).json({ error: err.message });
  }
  next();
};

module.exports = { upload, validateFileMIME, handleUploadError };
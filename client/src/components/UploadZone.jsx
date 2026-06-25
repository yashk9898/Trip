import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFile, FiImage, FiX, FiAlertCircle } from 'react-icons/fi';

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

const MAX_SIZE = 15 * 1024 * 1024; // 15 MB

const FileItem = ({ file, onRemove }) => {
  const isPdf = file.type === 'application/pdf';
  const sizeKb = (file.size / 1024).toFixed(0);
  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        background: isPdf ? 'rgba(239, 68, 68, 0.12)' : 'rgba(99, 102, 241, 0.12)',
        borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
        color: isPdf ? '#f87171' : 'var(--brand-primary)',
      }}>
        {isPdf ? <FiFile /> : <FiImage />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {file.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
          {file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`} · {file.type}
        </div>
      </div>
      <button
        onClick={() => onRemove(file)}
        style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', padding: 4, borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        title="Remove file"
      >
        <FiX size={16} />
      </button>
    </motion.div>
  );
};

const UploadZone = ({ files, onFilesChange, maxFiles = 10, disabled }) => {
  const [rejected, setRejected] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setRejected(rejectedFiles);
    const newFiles = [...files];
    for (const f of acceptedFiles) {
      if (newFiles.length < maxFiles && !newFiles.find(ef => ef.name === f.name && ef.size === f.size)) {
        newFiles.push(f);
      }
    }
    onFilesChange(newFiles);
  }, [files, maxFiles, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    maxFiles,
    disabled,
    multiple: true,
  });

  const removeFile = (fileToRemove) => {
    onFilesChange(files.filter(f => f !== fileToRemove));
  };

  const borderColor = isDragReject
    ? 'var(--error)'
    : isDragActive
    ? 'var(--brand-primary)'
    : 'var(--border-glass)';

  const bgColor = isDragReject
    ? 'rgba(239, 68, 68, 0.05)'
    : isDragActive
    ? 'rgba(99, 102, 241, 0.08)'
    : 'var(--bg-glass)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {/* Drop Zone */}
      <motion.div
        {...getRootProps()}
        whileHover={!disabled ? { borderColor: 'var(--brand-primary)' } : {}}
        style={{
          border: `2px dashed ${borderColor}`,
          borderRadius: 'var(--radius-lg)',
          background: bgColor,
          padding: 'var(--space-2xl) var(--space-lg)',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s ease',
          outline: 'none',
          opacity: disabled ? 0.6 : 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <input {...getInputProps()} />

        {/* Animated background on drag */}
        {isDragActive && !isDragReject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        )}

        <motion.div
          animate={{ y: isDragActive ? -4 : 0 }}
          transition={{ type: 'spring', stiffness: 400 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{
            width: 60, height: 60,
            background: isDragReject ? 'rgba(239, 68, 68, 0.12)' : 'rgba(99, 102, 241, 0.12)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-md)',
            fontSize: 24,
            color: isDragReject ? 'var(--error)' : 'var(--brand-primary)',
          }}>
            {isDragReject ? <FiAlertCircle /> : <FiUploadCloud />}
          </div>

          {isDragActive && !isDragReject ? (
            <p style={{ color: 'var(--brand-primary)', fontWeight: 600, margin: 0 }}>
              Drop files here!
            </p>
          ) : isDragReject ? (
            <p style={{ color: 'var(--error)', fontWeight: 600, margin: 0 }}>
              Invalid file type or size
            </p>
          ) : (
            <>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 6px', fontSize: '1rem' }}>
                Drag & drop your booking documents
              </p>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 var(--space-md)', fontSize: '0.85rem' }}>
                or <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>click to browse</span>
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['PDF', 'JPEG', 'PNG', 'WEBP'].map(type => (
                  <span key={type} style={{
                    padding: '3px 10px',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem', fontWeight: 600,
                    color: 'var(--text-muted)', letterSpacing: '0.05em',
                  }}>
                    {type}
                  </span>
                ))}
                <span style={{
                  padding: '3px 10px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem', fontWeight: 500,
                  color: 'var(--text-muted)',
                }}>
                  Max 15MB per file
                </span>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => onFilesChange([])}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Clear all
            </button>
          </div>
          <AnimatePresence>
            {files.map((file, i) => (
              <FileItem key={`${file.name}-${i}`} file={file} onRemove={removeFile} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Rejection Errors */}
      {rejected.length > 0 && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem', color: 'var(--error)',
        }}>
          {rejected.map(r => (
            <div key={r.file.name}>
              <strong>{r.file.name}</strong>: {r.errors.map(e => e.message).join(', ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadZone;

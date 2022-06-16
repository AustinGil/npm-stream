import { unstable_createFileUploadHandler } from '@remix-run/node';

export default unstable_createFileUploadHandler({
  directory: 'public/uploads',
  filter(file) {
    // Matcher for empty files
    if (
      file.filename === '' &&
      file.encoding === '7bit' &&
      file.mimetype === 'application/octet-stream'
    ) {
      return false;
    }
    return true;
  },
});

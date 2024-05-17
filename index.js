<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"></script>
  </head>
  <body>
    <div class="container">
      <h1>File Encryption and Decryption</h1>
      <div class="file-input-container">
        <span><p class="text">Upload Text Files:</p></span>
        <span><label for="fileInput" class="file">Browse...</label></span>
        <span><p id="selected-files-text" class="text">0 file selected</p></span>
      </div>
      <input type="file" id="fileInput" multiple />
      <div class="button-container">
        <button onclick="encryptFiles()">Encrypt</button>
        <button onclick="decryptFiles()">Decrypt</button>
      </div>
    </div>
    <script>
      function generateUniqueFilename(originalFilename) {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); // Get current date and time
        const extension = originalFilename.split(".")[1];
        return `${originalFilename.split(".")[0]}_${timestamp}.${extension}`;
      }
 
      function processFiles(encrypt) {
        const fileInput = document.getElementById("fileInput");
        const files = fileInput.files;
 
        if (files.length === 0) {
          alert("Please select one or more files.");
          return;
        }
 
        for (const file of files) {
          if (file) {
            const originalFilename = file.name;
            const uniqueFilename = generateUniqueFilename(originalFilename);
 
            if (encrypt) {
              const reader = new FileReader();
 
              reader.onload = function (event) {
                const originalText = event.target.result;
                const passphrase = "your-secret-passphrase";
 
                // Encrypt the text using CryptoJS (AES encryption)
                const encryptedText = CryptoJS.AES.encrypt(
                  originalText,
                  passphrase
                ).toString();
 
                // Create a new Blob with the encrypted text
                const encryptedBlob = new Blob([encryptedText], {
                  type: "text/plain",
                });
 
                // Create a download link for the encrypted file
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(encryptedBlob);
                downloadLink.download = uniqueFilename; // Set the desired filename
                downloadLink.click();
              };
 
              reader.readAsText(file); // Read the file as text
            } else {
              const reader = new FileReader();
 
              reader.onload = function (event) {
                const encryptedText = event.target.result; // Read the file content
                const passphrase = "your-secret-passphrase"; // Replace with your own passphrase
 
                // Decrypt the text using CryptoJS (AES decryption)
                const bytes = CryptoJS.AES.decrypt(encryptedText, passphrase);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);
 
                // Create a new Blob with the decrypted text
                const decryptedBlob = new Blob([originalText], {
                  type: "text/plain",
                });
 
                // Create a download link for the decrypted file
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(decryptedBlob);
                downloadLink.download = uniqueFilename; // Set the desired filename
                downloadLink.click();
              };
 
              reader.readAsText(file);
            }
          }
        }
      }
 
      function encryptFiles() {
        processFiles(true);
      }
 
      function decryptFiles() {
        processFiles(false);
      }
 
      const fileInput = document.getElementById("fileInput");
      const fileCountElement = document.getElementById("selected-files-text");
 
      fileInput.addEventListener("change", () => {
        const fileCount = fileInput.files.length;
        fileCountElement.textContent =
          fileCount === 1 ? "1 file selected" : `${fileCount} files selected`;
      });
    </script>
  </body>
</html>
 

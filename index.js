document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  const fileCountElement = document.getElementById("selected-files-text");
  const encryptFilesBtn = document.getElementById("encryptFiles");
  const decryptFilesBtn = document.getElementById("decryptFiles");
  const encryptTextBtn = document.getElementById("encryptText");
  const decryptTextBtn = document.getElementById("decryptText");

  fileInput.addEventListener("change", updateFileCount);
  encryptFilesBtn.addEventListener("click", () => processFiles(true));
  decryptFilesBtn.addEventListener("click", () => processFiles(false));
  encryptTextBtn.addEventListener("click", encryptText);
  decryptTextBtn.addEventListener("click", decryptText);
});

function updateFileCount() {
  const fileCount = this.files.length;
  const fileCountElement = document.getElementById("selected-files-text");
  fileCountElement.textContent =
    fileCount === 1 ? "1 file selected" : `${fileCount} files selected`;
}

function getPassphrase() {
  const passphraseInput = document.getElementById("passphraseInput");
  const passphrase = passphraseInput.value.trim();
  if (!passphrase) {
    alert("Please enter a passphrase.");
    return null;
  }
  return passphrase;
}

function generateUniqueFilename(originalFilename) {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
  const extension = originalFilename.split(".")[1];
  return `${originalFilename.split(".")[0]}_${timestamp}.${extension}`;
}

function processFiles(encrypt) {
  const passphrase = getPassphrase();
  if (!passphrase) {
    return;
  }
  const fileInput = document.getElementById("fileInput");
  const files = fileInput.files;
  if (files.length === 0) {
    alert("Please select one or more files.");
    return;
  }
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      let processedContent;
      if (encrypt) {
        processedContent = CryptoJS.AES.encrypt(
          fileContent,
          passphrase
        ).toString();
      } else {
        const decryptedBytes = CryptoJS.AES.decrypt(fileContent, passphrase);
        processedContent = decryptedBytes.toString(CryptoJS.enc.Utf8);
        if (!processedContent) {
          alert("Failed to decrypt the file with the provided passphrase.");
          return;
        }
      }
      const blob = new Blob([processedContent], { type: "text/plain" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = encrypt
        ? generateUniqueFilename(file.name)
        : file.name;
      downloadLink.click();
    };
    reader.readAsText(file);
  }

  document.getElementById("selected-files-text").textContent = "Select again to process";
}

function encryptText() {
  const inputText = document.getElementById("inputText").value;
  const passphrase = document.getElementById("passphraseInput").value;
  const errorMsg = document.getElementById("error-msg");
  errorMsg.style.display = "none";
  errorMsg.innerHTML = "";

  if (!passphrase) {
    errorMsg.innerHTML = "Please enter a passphrase.";
    errorMsg.style.display = "block";
    return;
  }

  if (!inputText) {
    errorMsg.innerHTML = "Please enter some text to encrypt.";
    errorMsg.style.display = "block";
    return;
  }

  const encrypted = CryptoJS.AES.encrypt(inputText, passphrase).toString();
  document.getElementById("outputText").value = encrypted;
}

function decryptText() {
  const encryptedText = document.getElementById("inputText").value;
  const passphrase = document.getElementById("passphraseInput").value;
  const errorMsg = document.getElementById("error-msg");
  errorMsg.style.display = "none";
  errorMsg.innerHTML = "";

  if (!passphrase) {
    errorMsg.innerHTML = "Please enter a passphrase.";
    errorMsg.style.display = "block";
    return;
  }

  if (!encryptedText) {
    errorMsg.innerHTML = "Please enter some text to decrypt.";
    errorMsg.style.display = "block";
    return;
  }

  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, passphrase);
    const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (decrypted) {
      document.getElementById("outputText").value = decrypted;
    } else {
      errorMsg.innerHTML =
        "Failed to decrypt. Please check the passphrase and try again.";
      errorMsg.style.display = "block";
    }
  } catch (error) {
    errorMsg.innerHTML =
      "An error occurred during decryption. Please check the input and try again.";
    errorMsg.style.display = "block";
  }
}

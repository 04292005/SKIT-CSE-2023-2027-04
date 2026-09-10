/**
 * Converts a File into a Base64 string (without the data URL prefix).
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("Failed to convert file."));
        return;
      }

      const base64 = result.split(",")[1];

      resolve(base64);
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}
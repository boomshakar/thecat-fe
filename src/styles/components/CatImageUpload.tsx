import React, { useEffect } from "react";
import { UploadIcon } from "../../assets/icons";

export const CatImageUpload = () => {
  useEffect(() => {
    const supportDrag = () => {
      const div = document.createElement("div");
      return (
        "draggable" in div ||
        ("ondragstart" in div && "ondrop" in div && "FormData" in window && "FileReader" in window)
      );
    };

    const input = document.getElementById("js-file-input");
    const fileInputEl = document.querySelector(".file-input");

    if (!supportDrag()) {
      const hasDragEl = document?.querySelector(".has-drag");
      hasDragEl && hasDragEl.classList.remove("has-drag");
    } else {
      const handleDragEnter = () => {
        fileInputEl && fileInputEl.classList.add("file-input--active");
      };

      const handleDragLeave = () => {
        fileInputEl && fileInputEl.classList.remove("file-input--active");
      };

      input?.addEventListener("dragenter", handleDragEnter);
      input?.addEventListener("dragleave", handleDragLeave);

      // Cleanup function
      return () => {
        input?.removeEventListener("dragenter", handleDragEnter);
        input?.removeEventListener("dragleave", handleDragLeave);
      };
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInputEl = document.querySelector(".file-input");
    console.log({ files: e.target.files });
    fileInputEl && fileInputEl.classList.remove("file-input--active");
  };

  return (
    <div className="file-container">
      <label htmlFor="js-file-input" className="file-wrapper">
        <input id="js-file-input" accept="image/*" type="file" onChange={handleFileChange} className="file-input" />
        <div className="file-content">
          <div className="file-infos">
            <span className="file-icon">
              <UploadIcon />
              <span className="icon-shadow"></span>
              <span>
                Click to browse
                <span className="has-drag"> or drop file here</span>
              </span>
            </span>
          </div>
          <span id="js-file-name" className="file-name">
            No file selected
          </span>
        </div>
      </label>
    </div>
  );
};

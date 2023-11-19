import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadIcon } from "../assets/icons";
import useMutation from "../hooks/useMutation";

export const CatImageUpload = () => {
  const [file, setFile] = useState<FileList | null>(null);

  const navigate = useNavigate();

  const { triggerFetch: uploadImage, loading, error } = useMutation();

  // Effect to handle drag and drop functionality for file input
  useEffect(() => {
    // Check if the browser supports drag and drop
    const supportDrag = () => "draggable" in document.createElement("div");

    // Get references to HTML elements
    const input = document.getElementById("js-file-input");
    const fileInputEl = document.querySelector(".file-input");

    // Remove drag-related styles if drag and drop are not supported
    if (!supportDrag()) {
      const hasDragEl = document?.querySelector(".has-drag");
      hasDragEl && hasDragEl.classList.remove("has-drag");
    } else {
      // Add event listeners for drag enter and drag leave to show visual feedback
      const handleDragEnter = () => {
        fileInputEl && fileInputEl.classList.add("file-input--active");
      };

      const handleDragLeave = () => {
        fileInputEl && fileInputEl.classList.remove("file-input--active");
      };

      input?.addEventListener("dragenter", handleDragEnter);
      input?.addEventListener("dragleave", handleDragLeave);

      // Cleanup function to remove event listeners
      return () => {
        input?.removeEventListener("dragenter", handleDragEnter);
        input?.removeEventListener("dragleave", handleDragLeave);
      };
    }
  }, []);

  // Callback function to handle image upload
  const imageUploadHanlder = useCallback(() => {
    // Get user ID from local storage
    const getUserId = localStorage?.getItem("boomcat-uid");

    // Check if file and user ID are available
    if (file && getUserId) {
      // Create a FormData object for the image upload
      const formPayload = new FormData();
      formPayload.append("file", file[0]);
      formPayload.append("sub_id", getUserId);

      // Trigger the image upload API request
      uploadImage({
        method: "POST",
        url: "/images/upload",
        body: formPayload,
        headers: {},
        onSuccess: () => navigate("/"),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Effect to trigger image upload when file state is uploaded
  useEffect(() => {
    imageUploadHanlder();
  }, [imageUploadHanlder]);

  // Handler for file input change event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInputEl = document.querySelector(".file-input");
    // Set the selected file and remove active styles
    setFile(e.target.files);
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
          {loading ? (
            <div className="is-loading">
              <div className="is-loading-icon"></div>
            </div>
          ) : error ? (
            <span className="font-lato font-700 error_resp">Sorry, an error occured. Please try again later</span>
          ) : !file ? (
            <span id="js-file-name" className="file-name">
              No file selected
            </span>
          ) : null}
        </div>
      </label>
    </div>
  );
};

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadIcon } from "../assets/icons";
import useFetch from "../hooks/useFetch";

export const CatImageUpload = () => {
  const [file, setFile] = useState<FileList | null>(null);

  const navigate = useNavigate();

  const {
    triggerFetch: uploadImage,
    loading,
    error,
  } = useFetch("/images/upload", false, {
    onSuccess: () => navigate("/"),
  });

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

  const imageUploadHanlder = useCallback(() => {
    const getUserId = localStorage?.getItem("boomcat-uid");
    if (file && getUserId) {
      const formPayload = new FormData();
      formPayload.append("file", file[0]);
      formPayload.append("sub_id", getUserId);
      uploadImage({
        method: "POST",
        url: "/images/upload",
        body: formPayload,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    imageUploadHanlder();
  }, [imageUploadHanlder]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInputEl = document.querySelector(".file-input");
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
            <span className="font-lato font-700 error_resp">Sorry, an error occured. Pleas try again later</span>
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

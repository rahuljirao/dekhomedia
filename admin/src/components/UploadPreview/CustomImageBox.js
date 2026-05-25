import React, { useEffect, useState } from 'react';

const CustomImageBox = ({ onChange, imageUrl, label, name, ...props }) => {
    const [imageSrc, setImageSrc] = useState(imageUrl);

    useEffect(() => {
        setImageSrc(imageUrl);
    }, [imageUrl]);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImageSrc(objectUrl);
            onChange(event, file, objectUrl);

            // Optional: revoke after load (to free memory)
            const img = new Image();
            img.src = objectUrl;
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
            };
        } else {
            onChange(event, '', '');
            setImageSrc(imageUrl);
        }
    };

    return (
        <div {...props} >
            <label htmlFor="poster_edit" className="form-label">{label}</label>
            <div className="position-relative">
                <div className="upload-options">
                    <label htmlFor="poster_edit">
                        <input
                            name={name}
                            type="file"
                            accept=".png, .jpg, .jpeg, .webp"
                            onChange={handleImageChange}
                            id="poster_edit"
                        />
                    </label>
                </div>
                <img
                    id="live_tv_profile_edit"
                    className="custom_img img-fluid actor_profile modal_placeholder_image"
                    src={imageSrc}
                    alt="Preview"
                />
            </div>
        </div>
    );
};

export default CustomImageBox;

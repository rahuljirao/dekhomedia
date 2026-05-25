import React, { useEffect, useState } from 'react';

const CustomVideoBox = ({ onChange, videoUrl, label, name, ...props }) => {
    const [videoSrc, setVideoSrc] = useState(videoUrl);
    const [type, setType] = useState('');

    useEffect(() => {
        setVideoSrc(videoUrl);
        setType(/\.(jpeg|jpg|png|gif|webp)$/i.test(videoUrl));
    }, [videoUrl]);

    const handleVideoChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setVideoSrc(objectUrl);
            setType(false);
            onChange(event, file, objectUrl);

            const video = document.createElement('video');
            video.src = objectUrl;
            video.onloadeddata = () => {
                URL.revokeObjectURL(objectUrl);
            };
        } else {
            onChange(event, '', '');
            setType(true);
            setVideoSrc(videoUrl);
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
                            accept="video/mp4, video/webm, video/ogg"
                            onChange={handleVideoChange}
                            id="poster_edit"
                        />
                    </label>
                </div>
                {
                    type ? 
                        <img
                            id="live_tv_profile_edit"
                            className="custom_img img-fluid actor_profile modal_placeholder_image"
                            src={videoSrc}
                            alt="Preview"
                        />
                    : 
                    <video
                        id="video_preview"
                        className="custom_img img-fluid actor_profile modal_placeholder_image"
                        src={videoSrc}
                        controls
                        width="100%"
                        style={{ borderRadius: '8px', marginTop: '10px' }}
                    />
                }
            </div>
        </div>
    );
};

export default CustomVideoBox;

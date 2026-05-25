import React from "react";

const Model = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
			<div className="bg-white rounded-lg shadow-lg p-6 w-[35rem]">
				<div className="flex justify-between items-center border-b pb-2">
					<h2 className="text-lg font-semibold">{title}</h2>
					<button
						onClick={onClose}
						className="text-green-500 hover:text-green-700"
					>
						<svg className={`w-6 h-6  fill-current text-[#1F7A1F]`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 0 0-1.4 1.4L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4z"/>
                        </svg>
					</button>
				</div>
				<div className="py-4">{children}</div>
			</div>
		</div>
	);
};

export default Model;

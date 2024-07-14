import React, { useState, useEffect } from 'react';

const WarningUpdate = ({ isOpen, onConfirm, onCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-stone-950 rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <p className="text-gray-800 mb-6">
              Apakah anda yakin ingin mengupdate sebuah campaign? Bila anda yakin silahkan pilih yes, tetapi bila anda tidak yakin silahkan pilih no. saya tidak akan bertanggung jawab bila ada masalah
            </p>
            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleConfirm}
              >
                Yes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WarningUpdate;

import React, { useState, useEffect } from 'react';

const WarningDelete = ({ isOpen, onConfirm, onCancel }) => {
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
            <p className="text-white mb-6">
            Are you sure you want to delete this campaign? If you are sure please select yes, but if you are not sure please select Cancel. FundPI will not be responsible if there is a problem.
            </p>
            <div className="flex justify-end space-x-2">
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
export default WarningDelete;

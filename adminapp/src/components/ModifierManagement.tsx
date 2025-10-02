import React, { useState } from 'react';
import { useMenuModifiers, useCreateMenuModifier, useUpdateMenuModifier, useDeleteMenuModifier } from '../hooks/useMenu';
import { ModifierCopy } from './ModifierCopy';
import type { Database } from '../types/database';

interface ModifierManagementProps {
  itemId: string;
  itemName: string;
  merchantId: string;
  onClose: () => void;
}

export const ModifierManagement: React.FC<ModifierManagementProps> = ({ itemId, itemName, merchantId, onClose }) => {
  const { data: modifiers = [], isLoading } = useMenuModifiers(itemId);
  const createModifier = useCreateMenuModifier();
  const updateModifier = useUpdateMenuModifier();
  const deleteModifier = useDeleteMenuModifier();

  const [showForm, setShowForm] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [editingModifier, setEditingModifier] = useState<Database.MenuModifiers | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Database.MenuModifiers | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'single_choice' as 'single_choice' | 'multiple_choice' | 'text_input',
    required: false,
    minSelections: 0,
    maxSelections: 1,
    options: [{ name: '', price: 0 }],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'single_choice',
      required: false,
      minSelections: 0,
      maxSelections: 1,
      options: [{ name: '', price: 0 }],
    });
    setEditingModifier(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const modifierData: Partial<Database.MenuModifiers> = {
        item_id: itemId,
        name: formData.name,
        type: formData.type,
        required: formData.required,
        options: formData.type === 'text_input' ? {} : formData.options,
      };

      if (formData.type === 'multiple_choice') {
        modifierData.min_selections = formData.minSelections;
        modifierData.max_selections = formData.maxSelections;
      }

      if (editingModifier) {
        await updateModifier.mutateAsync({
          id: editingModifier.id,
          data: modifierData,
        });
      } else {
        await createModifier.mutateAsync(modifierData);
      }

      resetForm();
    } catch (error) {
      console.error('Failed to save modifier:', error);
    }
  };

  const handleEdit = (modifier: Database.MenuModifiers) => {
    setEditingModifier(modifier);
    setFormData({
      name: modifier.name,
      type: modifier.type,
      required: modifier.required,
      minSelections: modifier.min_selections || 0,
      maxSelections: modifier.max_selections || 1,
      options: modifier.type === 'text_input' ? [{ name: '', price: 0 }] :
              Array.isArray(modifier.options) ? modifier.options :
              Object.entries(modifier.options || {}).map(([name, price]) => ({ name, price: Number(price) })),
    });
    setShowForm(true);
  };

  const handleDelete = (modifier: Database.MenuModifiers) => {
    setDeleteTarget(modifier);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteModifier.mutateAsync({ id: deleteTarget.id, itemId });
        setShowDeleteDialog(false);
        setDeleteTarget(null);
      } catch (error) {
        console.error('Failed to delete modifier:', error);
      }
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { name: '', price: 0 }]
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const updateOption = (index: number, field: 'name' | 'price', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Modifiers for "{itemName}"
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="flex space-x-3">
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add Modifier
            </button>
            <button
              onClick={() => setShowCopyModal(true)}
              className="btn-secondary"
            >
              Copy from Other Items
            </button>
          </div>
        </div>

        {/* Modifier Form */}
        {showForm && (
          <div className="card mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {editingModifier ? 'Edit Modifier' : 'Add New Modifier'}
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modifier Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Size, Add-ons, Spice Level"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      type: e.target.value as 'single_choice' | 'multiple_choice' | 'text_input'
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="single_choice">Single Choice</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="text_input">Text Input</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={formData.required}
                  onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="required" className="ml-2 block text-sm text-gray-900">
                  Required modifier
                </label>
              </div>

              {formData.type === 'multiple_choice' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Selections
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minSelections}
                      onChange={(e) => setFormData(prev => ({ ...prev, minSelections: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Selections
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxSelections}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxSelections: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}

              {formData.type !== 'text_input' && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Options
                    </label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      + Add Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Option name"
                          value={option.name}
                          onChange={(e) => updateOption(index, 'name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-1">₱</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={option.price}
                            onChange={(e) => updateOption(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                        {formData.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createModifier.isPending || updateModifier.isPending}
                  className="btn-primary"
                >
                  {(createModifier.isPending || updateModifier.isPending)
                    ? (editingModifier ? 'Updating...' : 'Creating...')
                    : (editingModifier ? 'Update Modifier' : 'Create Modifier')
                  }
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modifiers List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : modifiers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Modifiers Yet</h3>
            <p className="text-gray-600 mb-4">Add modifiers to customize this menu item</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add First Modifier
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modifiers.map((modifier) => (
              <div key={modifier.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{modifier.name}</h4>
                    <div className="flex items-center mt-1 space-x-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        modifier.type === 'single_choice' ? 'bg-blue-100 text-blue-800' :
                        modifier.type === 'multiple_choice' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {modifier.type === 'single_choice' ? 'Single Choice' :
                         modifier.type === 'multiple_choice' ? 'Multiple Choice' :
                         'Text Input'}
                      </span>
                      {modifier.required && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      )}
                    </div>
                    
                    {modifier.type !== 'text_input' && modifier.options && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Options:</p>
                        <div className="text-sm text-gray-700">
                          {Array.isArray(modifier.options) 
                            ? modifier.options.map((opt, i) => (
                                <div key={i} className="flex justify-between">
                                  <span>{opt.name}</span>
                                  <span>₱{opt.price.toFixed(2)}</span>
                                </div>
                              ))
                            : Object.entries(modifier.options).map(([name, price], i) => (
                                <div key={i} className="flex justify-between">
                                  <span>{name}</span>
                                  <span>₱{Number(price).toFixed(2)}</span>
                                </div>
                              ))
                          }
                        </div>
                      </div>
                    )}

                    {modifier.type === 'multiple_choice' && (
                      <div className="mt-2 text-xs text-gray-500">
                        Min: {modifier.min_selections || 0}, Max: {modifier.max_selections || 1}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(modifier)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(modifier)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && deleteTarget && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.860-.833-2.630 0L5.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Modifier</h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setDeleteTarget(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteModifier.isPending}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleteModifier.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Copy Modifiers Modal */}
        {showCopyModal && (
          <ModifierCopy
            targetItemId={itemId}
            targetItemName={itemName}
            merchantId={merchantId}
            onClose={() => setShowCopyModal(false)}
            onComplete={() => {
              setShowCopyModal(false);
              // Modifiers will be automatically refetched due to cache invalidation
            }}
          />
        )}
      </div>
    </div>
  );
};

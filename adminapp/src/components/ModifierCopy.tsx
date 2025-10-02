import React, { useState, useMemo } from 'react';
import { useMenuItems, useMenuCategories, useMenuModifiers, useBatchCopyModifiers } from '../hooks/useMenu';
import type { Database } from '../types/database';

interface ModifierCopyProps {
  targetItemId: string;
  targetItemName: string;
  merchantId: string;
  onClose: () => void;
  onComplete: () => void;
}

interface ModifierToCopy {
  id: string;
  name: string;
  customName?: string;
  selected: boolean;
}

type CopyStep = 'source_selection' | 'modifier_selection' | 'confirmation';

export const ModifierCopy: React.FC<ModifierCopyProps> = ({ 
  targetItemId, 
  targetItemName, 
  merchantId, 
  onClose, 
  onComplete 
}) => {
  const { data: categories = [] } = useMenuCategories(merchantId);
  const { data: allMenuItems = [] } = useMenuItems(merchantId);
  const batchCopyModifiers = useBatchCopyModifiers();

  const [currentStep, setCurrentStep] = useState<CopyStep>('source_selection');
  const [selectedSourceItemId, setSelectedSourceItemId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modifiersToCopy, setModifiersToCopy] = useState<ModifierToCopy[]>([]);

  // Get modifiers for the selected source item
  const { data: sourceModifiers = [], isLoading: loadingModifiers } = useMenuModifiers(
    selectedSourceItemId,
  );

  // Filter menu items (exclude the target item)
  const availableSourceItems = useMemo(() => {
    return allMenuItems.filter(item => {
      if (item.id === targetItemId) return false;
      
      const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [allMenuItems, targetItemId, selectedCategory, searchQuery]);

  // Group items by category for display
  const itemsByCategory = useMemo(() => {
    const grouped = availableSourceItems.reduce((acc, item) => {
      const category = categories.find(cat => cat.id === item.category_id);
      const categoryName = category?.name || 'Uncategorized';
      
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      
      return acc;
    }, {} as Record<string, Database.MenuItems[]>);
    
    return grouped;
  }, [availableSourceItems, categories]);

  // Initialize modifiers when source item is selected
  React.useEffect(() => {
    if (sourceModifiers.length > 0) {
      setModifiersToCopy(
        sourceModifiers.map(modifier => ({
          id: modifier.id,
          name: modifier.name,
          customName: modifier.name,
          selected: false,
        }))
      );
    }
  }, [sourceModifiers]);

  const handleSourceItemSelect = (itemId: string) => {
    setSelectedSourceItemId(itemId);
    setCurrentStep('modifier_selection');
  };

  const handleModifierToggle = (modifierId: string) => {
    setModifiersToCopy(prev => 
      prev.map(modifier => 
        modifier.id === modifierId 
          ? { ...modifier, selected: !modifier.selected }
          : modifier
      )
    );
  };

  const handleCustomNameChange = (modifierId: string, customName: string) => {
    setModifiersToCopy(prev => 
      prev.map(modifier => 
        modifier.id === modifierId 
          ? { ...modifier, customName }
          : modifier
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = modifiersToCopy.every(m => m.selected);
    setModifiersToCopy(prev => 
      prev.map(modifier => ({ ...modifier, selected: !allSelected }))
    );
  };

  const handleCopyConfirm = async () => {
    const selectedModifiers = modifiersToCopy
      .filter(modifier => modifier.selected)
      .map(modifier => ({
        id: modifier.id,
        name: modifier.customName !== modifier.name ? modifier.customName : undefined,
      }));

    if (selectedModifiers.length === 0) return;

    try {
      await batchCopyModifiers.mutateAsync({
        fromItemId: selectedSourceItemId,
        toItemId: targetItemId,
        modifiersToCopy: selectedModifiers,
      });
      onComplete();
    } catch (error) {
      console.error('Failed to copy modifiers:', error);
    }
  };

  const selectedSourceItem = allMenuItems.find(item => item.id === selectedSourceItemId);
  const selectedCount = modifiersToCopy.filter(m => m.selected).length;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-lg shadow-lg flex flex-col">
        {/* Header - Fixed at top */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Copy Modifiers to "{targetItemName}"
              </h3>
              <div className="flex items-center mt-2">
                {/* Step indicators */}
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    currentStep === 'source_selection' ? 'bg-primary-600' : 
                    selectedSourceItemId ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm text-gray-600">Select Source</span>
                  <div className="w-4 h-0.5 bg-gray-300" />
                  <div className={`w-3 h-3 rounded-full ${
                    currentStep === 'modifier_selection' ? 'bg-primary-600' : 
                    selectedCount > 0 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm text-gray-600">Choose Modifiers</span>
                  <div className="w-4 h-0.5 bg-gray-300" />
                  <div className={`w-3 h-3 rounded-full ${
                    currentStep === 'confirmation' ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm text-gray-600">Confirm</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content - Scrollable middle section */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{/* Step 1: Source Item Selection */}
          {currentStep === 'source_selection' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Select a menu item to copy modifiers from:</h4>
                
                {/* Search and Filter */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items List */}
              {availableSourceItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No menu items found. Try adjusting your search or filter.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(itemsByCategory).map(([categoryName, items]) => (
                    <div key={categoryName}>
                      <h5 className="font-medium text-gray-700 mb-2">{categoryName}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSourceItemSelect(item.id)}
                            className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                          >
                            <div>
                              <h6 className="font-medium text-gray-900">{item.name}</h6>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-semibold text-primary-600">
                                  ₱{item.price.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Click to select
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Modifier Selection */}
          {currentStep === 'modifier_selection' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Select modifiers from "{selectedSourceItem?.name}"
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose which modifiers to copy and optionally rename them
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep('source_selection')}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  ← Change Source
                </button>
              </div>

              {modifiersToCopy.length > 0 && (
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    {modifiersToCopy.every(m => m.selected) ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedCount} of {modifiersToCopy.length} selected
                  </span>
                </div>
              )}

              {/* Modifiers List */}
              {loadingModifiers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : modifiersToCopy.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h5 className="text-lg font-medium text-gray-900 mb-2">No Modifiers Found</h5>
                  <p className="text-gray-600">This item doesn't have any modifiers to copy.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {modifiersToCopy.map((modifier) => {
                    const sourceModifier = sourceModifiers.find(m => m.id === modifier.id);
                    return (
                      <div
                        key={modifier.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          modifier.selected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={modifier.selected}
                            onChange={() => handleModifierToggle(modifier.id)}
                            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h6 className="font-medium text-gray-900">{modifier.name}</h6>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    sourceModifier?.type === 'single_choice' ? 'bg-blue-100 text-blue-800' :
                                    sourceModifier?.type === 'multiple_choice' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {sourceModifier?.type === 'single_choice' ? 'Single Choice' :
                                     sourceModifier?.type === 'multiple_choice' ? 'Multiple Choice' :
                                     'Text Input'}
                                  </span>
                                  {sourceModifier?.required && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Required
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Custom Name Input */}
                            {modifier.selected && (
                              <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Modifier name (optional):
                                </label>
                                <input
                                  type="text"
                                  value={modifier.customName}
                                  onChange={(e) => handleCustomNameChange(modifier.id, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  placeholder={modifier.name}
                                />
                              </div>
                            )}

                            {/* Options Preview */}
                            {sourceModifier?.type !== 'text_input' && sourceModifier?.options && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Options:</p>
                                <div className="text-sm text-gray-700 max-h-20 overflow-y-auto">
                                  {Array.isArray(sourceModifier.options) 
                                    ? sourceModifier.options.slice(0, 3).map((opt, i) => (
                                        <div key={i} className="flex justify-between">
                                          <span>{opt.name}</span>
                                          <span>₱{Number(opt.price).toFixed(2)}</span>
                                        </div>
                                      ))
                                    : Object.entries(sourceModifier.options).slice(0, 3).map(([name, price], i) => (
                                        <div key={i} className="flex justify-between">
                                          <span>{name}</span>
                                          <span>₱{Number(price).toFixed(2)}</span>
                                        </div>
                                      ))
                                  }
                                  {(Array.isArray(sourceModifier.options) ? sourceModifier.options.length : Object.keys(sourceModifier.options).length) > 3 && (
                                    <div className="text-xs text-gray-400">
                                      ...and {(Array.isArray(sourceModifier.options) ? sourceModifier.options.length : Object.keys(sourceModifier.options).length) - 3} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 'confirmation' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Confirm Copy Operation</h4>
                <p className="text-sm text-gray-600">
                  The following {selectedCount} modifier{selectedCount !== 1 ? 's' : ''} will be copied to "{targetItemName}":
                </p>
              </div>

              <div className="space-y-2">
                {modifiersToCopy
                  .filter(modifier => modifier.selected)
                  .map((modifier) => {
                    const sourceModifier = sourceModifiers.find(m => m.id === modifier.id);
                    const willRename = modifier.customName !== modifier.name;
                    
                    return (
                      <div key={modifier.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">
                              {modifier.name}
                              {willRename && (
                                <span className="text-primary-600"> → {modifier.customName}</span>
                              )}
                            </span>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                sourceModifier?.type === 'single_choice' ? 'bg-blue-100 text-blue-800' :
                                sourceModifier?.type === 'multiple_choice' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {sourceModifier?.type === 'single_choice' ? 'Single Choice' :
                                 sourceModifier?.type === 'multiple_choice' ? 'Multiple Choice' :
                                 'Text Input'}
                              </span>
                              {sourceModifier?.required && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                          {willRename && (
                            <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
                              Renamed
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        {(currentStep === 'modifier_selection' && selectedCount > 0) || currentStep === 'confirmation' ? (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  if (currentStep === 'confirmation') {
                    setCurrentStep('modifier_selection');
                  } else {
                    setCurrentStep('source_selection');
                  }
                }}
                className="btn-secondary"
              >
                Back
              </button>
              {currentStep === 'modifier_selection' ? (
                <button
                  onClick={() => setCurrentStep('confirmation')}
                  className="btn-primary"
                >
                  Review & Copy ({selectedCount})
                </button>
              ) : (
                <button
                  onClick={handleCopyConfirm}
                  disabled={batchCopyModifiers.isPending}
                  className="btn-primary"
                >
                  {batchCopyModifiers.isPending ? 'Copying...' : `Copy ${selectedCount} Modifier${selectedCount !== 1 ? 's' : ''}`}
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

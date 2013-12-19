goog.provide('anychart.data.SortView');

goog.require('anychart.data.View');
goog.require('goog.array');



/**
 * Sorting view.
 * @param {!anychart.data.IView} parentView Parent view. The last view is a mapping.
 * @param {string} fieldName Field name to make sort by.
 * @param {function(*, *):number=} opt_comparator Sorting function that should accept two field values and return
 *    numeric result of the comparison.
 * @constructor
 * @extends {anychart.data.View}
 */
anychart.data.SortView = function(parentView, fieldName, opt_comparator) {
  goog.base(this, parentView);

  /**
   * Field name to categorize by. Stored for data change events.
   * @type {string}
   * @private
   */
  this.fieldName_ = fieldName;

  var comparator = opt_comparator || anychart.utils.compare;

  /**
   * Comparison function.
   * @param {{value, index:number}} obj1 First object.
   * @param {{value, index:number}} obj2 Second object.
   * @return {number} Comparison result.
   * @private
   */
  this.comparator_ = function(obj1, obj2) {
    return comparator(obj1.value, obj2.value) || obj1.index - obj2.index;
  };
};
goog.inherits(anychart.data.SortView, anychart.data.View);


/** @inheritDoc */
anychart.data.SortView.prototype.buildMask = function() {
  var mask = [];
  var iterator = this.parentView.getIterator();
  while (iterator.advance()) {
    mask.push({value: iterator.get(this.fieldName_), index: iterator.getIndex()});
  }
  goog.array.sort(mask, this.comparator_);
  for (var i = mask.length; i--;)
    mask[i] = mask[i].index;
  return mask;
};

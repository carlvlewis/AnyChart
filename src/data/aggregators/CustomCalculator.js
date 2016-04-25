goog.provide('anychart.data.aggregators.CustomCalculator');
goog.require('anychart.data.aggregators.Base');
goog.require('anychart.opt');



/**
 * Counts the average between all passed non-NaN values as the value of the aggregate.
 * @param {number|string} valuesColumn
 * @param {{reset:function(),considerItem:function(*,(Array|Object)),getResult:function():*}} calculator
 * @constructor
 * @extends {anychart.data.aggregators.Base}
 */
anychart.data.aggregators.CustomCalculator = function(valuesColumn, calculator) {
  /**
   * Calculator.
   * @type {{reset: (function()), considerItem: (function(*,(Array|Object))), getResult: (function(): *)}}
   * @private
   */
  this.calculator_ = calculator;

  goog.base(this, valuesColumn);
};
goog.inherits(anychart.data.aggregators.CustomCalculator, anychart.data.aggregators.Base);


/** @inheritDoc */
anychart.data.aggregators.CustomCalculator.prototype.clear = function() {
  this.calculator_[anychart.opt.RESET]();
};


/** @inheritDoc */
anychart.data.aggregators.CustomCalculator.prototype.process = function(value, weight, row) {
  this.calculator_[anychart.opt.CONSIDER_ITEM](value, row);
};


/** @inheritDoc */
anychart.data.aggregators.CustomCalculator.prototype.getValueAndClear = function() {
  var res = this.calculator_[anychart.opt.GET_RESULT]();
  this.clear();
  return res;
};


/** @inheritDoc */
anychart.data.aggregators.CustomCalculator.prototype.disposeInternal = function() {
  delete this.calculator_;
  anychart.data.aggregators.CustomCalculator.base(this, 'disposeInternal');
};

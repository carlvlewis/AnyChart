goog.provide('anychart.core.utils.DrawingPlanIterator');
goog.require('anychart.data.Iterator');



/**
 *
 * @param {anychart.core.series.Cartesian} series
 * @constructor
 * @extends {anychart.data.Iterator}
 */
anychart.core.utils.DrawingPlanIterator = function(series) {
  /**
   * @type {anychart.core.series.Cartesian}
   * @private
   */
  this.series_ = series;
  anychart.core.utils.DrawingPlanIterator.base(this, 'constructor', /** @type {!anychart.data.View} */(series.data()));
};
goog.inherits(anychart.core.utils.DrawingPlanIterator, anychart.data.Iterator);


/** @inheritDoc */
anychart.core.utils.DrawingPlanIterator.prototype.reset = function() {
  /**
   * @type {Array.<{data:Object, meta:Object}>}
   * @private
   */
  this.data_ = this.series_.drawingPlan.data;

  return anychart.core.utils.DrawingPlanIterator.base(this, 'reset');
};


/** @inheritDoc */
anychart.core.utils.DrawingPlanIterator.prototype.advance = function() {
  this.currentIndex++;
  this.currentPoint_ = this.data_[this.currentIndex];
  this.currentRow = undefined;
  return this.currentIndex < this.data_.length;
};


/**
 * Returns raw data index for the current row.
 * @return {number}
 */
anychart.core.utils.DrawingPlanIterator.prototype.getRawDataIndex = function() {
  return /** @type {number} */(this.meta(anychart.opt.RAW_INDEX));
};


/** @inheritDoc */
anychart.core.utils.DrawingPlanIterator.prototype.get = function(fieldName) {
  var res = undefined;
  if (this.currentPoint_) {
    if (fieldName in this.currentPoint_.data) {
      res = this.currentPoint_.data[fieldName];
    } else {
      //anychart.core.utils.DrawingPlanIterator.misses[fieldName] = true;
      var rawIndex = this.currentPoint_.meta[anychart.opt.RAW_INDEX];
      if (!this.currentRow) {
        if (goog.isDef(rawIndex))
          this.currentRow = this.view.row(rawIndex);
        else
          return this.currentPoint_.data[fieldName] = res;//undefined
      }
      // aggressively caching
      this.currentPoint_.data[fieldName] = res =
          this.view.getRowMapping(rawIndex).getInternal(this.currentRow, rawIndex, fieldName);
    }
  }
  return res;
};


/** @inheritDoc */
anychart.core.utils.DrawingPlanIterator.prototype.getRowsCount = function() {
  return this.data_.length;
};


/** @inheritDoc */
anychart.core.utils.DrawingPlanIterator.prototype.meta = function(name, opt_value) {
  var isSetter = arguments.length > 1;
  if (!this.currentPoint_) {
    return isSetter ? this : undefined;
  }
  var meta = this.currentPoint_.meta;
  if (isSetter) {
    meta[name] = opt_value;
    return this;
  } else
    return meta[name];
};


//exports
anychart.core.utils.DrawingPlanIterator.prototype['reset'] = anychart.core.utils.DrawingPlanIterator.prototype.reset;//doc|ex
anychart.core.utils.DrawingPlanIterator.prototype['advance'] = anychart.core.utils.DrawingPlanIterator.prototype.advance;//doc|ex
anychart.core.utils.DrawingPlanIterator.prototype['get'] = anychart.core.utils.DrawingPlanIterator.prototype.get;//doc|ex
anychart.core.utils.DrawingPlanIterator.prototype['meta'] = anychart.core.utils.DrawingPlanIterator.prototype.meta;//doc|need-ex
anychart.core.utils.DrawingPlanIterator.prototype['getRowsCount'] = anychart.core.utils.DrawingPlanIterator.prototype.getRowsCount;//doc|ex

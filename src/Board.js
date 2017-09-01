// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {  // O(n)
      var rows = this.rows();
      var row = rows[rowIndex];
      var result = row.reduce((rowSum, column) => rowSum + column);
      return result >= 2;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {  // O(n^2)
      for (var i = 0; i < this.attributes.n; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {  //O(n)
      var rows = this.rows();
      var colConflict = rows.reduce((colSum, row) => colSum + row[colIndex], 0);
      return colConflict >= 2;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {  //O(n^2)
      for (var i = 0; i < this.attributes.n; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(colIndex, rowIndex = 0) {
      var rows = this.rows();
      var diagonalSum = 0; 
      var col = colIndex;
      var row = rowIndex;
      for (col, row; col < this.attributes.n; col++, row++) {
        if (row === this.attributes.n) {
          break;
        }
        diagonalSum += rows[row][col];
        if (diagonalSum >= 2) {
          return true;
        }
      }
      col = colIndex - 1;
      row = rowIndex - 1;
      for (col, row; col >= 0; col--, row--) {
        if (row < 0) {
          break;
        }
        diagonalSum += rows[row][col];
        if (diagonalSum >= 2) {
          return true;
        }
      }     

      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var rows = this.rows();
      for (var col = 0; col < this.attributes.n; col++) {
        if (this.hasMajorDiagonalConflictAt(col)) {
          return true; 
        }
      }    
      for (var row = 1; row < this.attributes.n; row++) {
        if (this.hasMajorDiagonalConflictAt(0, row)) {
          return true;
        }
      }      
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(colIndex, rowIndex = 0) {
      var rows = this.rows();
      var diagonalSum = 0;
      var len = this.attributes.n;
      var col = colIndex;
      var row = rowIndex;

      for (col, row; col >= 0; col--, row++) {
        if (row === len) {
          break;
        }
        diagonalSum += rows[row][col];
        if (diagonalSum >= 2) {
          return true;
        }
      }
      col = colIndex + 1;
      row = rowIndex - 1;
      for (col, row; col < len; col++, row--) {
        if (row < 0) {
          break;
        }
        diagonalSum += rows[row][col];
        if (diagonalSum >= 2) {
          return true;
        }
      }

      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var hasConflict = false;
      var rowIndex = 0;
      for (var colIndex = 0; colIndex < this.attributes.n; colIndex++) {
        this.hasMinorDiagonalConflictAt(colIndex, rowIndex) ? hasConflict = true : null;
      }
      colIndex = this.attributes.n - 1;
      for (var rowIndex = 1; rowIndex < this.attributes.n; rowIndex++) {
        this.hasMinorDiagonalConflictAt(colIndex, rowIndex) ? hasConflict = true : null;
      }
      return hasConflict;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

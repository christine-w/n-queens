/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var board = new Board({n: n});
  for (let i = 0; i < n; i++) {
    board.togglePiece(i, i);
  }
  var solution = board.rows();

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n: n});
  
  var buildSolution = function(piecesRemaining) {
    if (!piecesRemaining) {
      solutionCount++;
      return;
    }
    var rowIndex = n - piecesRemaining;
    for (var colIndex = 0; colIndex < n; colIndex++) {
      board.togglePiece(rowIndex, colIndex);
      if (board.hasAnyRooksConflicts()) {
        board.togglePiece(rowIndex, colIndex);
      } else {
        buildSolution(piecesRemaining - 1); 
        board.togglePiece(rowIndex, colIndex);
      }
    }
    
  };
  board.togglePiece(0, 0);
  buildSolution(n - 1);
  solutionCount *= n;
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution;
  var board = new Board({n: n});
  if (n === 0) {
    return board.rows();
  }
  var buildSolution = function(piecesRemaining) {
    if (!piecesRemaining) {
      if (!solution) {
        solution = board.rows();
      } else {
        console.log('what the heck');
      }
      return;
    }
    var rowIndex = n - piecesRemaining;
    for (var colIndex = 0; colIndex < n; colIndex++) { 
      board.togglePiece(rowIndex, colIndex);
      if (board.hasAnyQueensConflicts()) {
        if (colIndex === n - 1) {
          board.togglePiece(rowIndex, colIndex);
          break;
        }
        board.togglePiece(rowIndex, colIndex);
      } else {
        
        buildSolution(piecesRemaining - 1); 
        if (solution) {
          break;
        }
        board.togglePiece(rowIndex, colIndex);
      }
    }
    
  };
  //board.togglePiece(0, 1);
  for (var i = 0; i < n; i++) {
    if (!solution) {
      board = new Board({n: n});
      board.togglePiece(0, i);
      buildSolution(n - 1);
    }
  }
  if (!solution) {
    board = new Board({n: n});
    return board.rows();
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0; //fixme

  var board = new Board({n: n});
  if (n === 0) {
    return 1;
  }
  var buildSolution = function(piecesRemaining) {
    if (!piecesRemaining) {
      solutionCount++;
      return;
    }
    var rowIndex = n - piecesRemaining;
    for (var colIndex = 0; colIndex < n; colIndex++) { 
      board.togglePiece(rowIndex, colIndex);
      if (board.hasAnyQueensConflicts()) {
        if (colIndex === n - 1) {
          board.togglePiece(rowIndex, colIndex);
          break;
        }
        board.togglePiece(rowIndex, colIndex);
      } else {
        
        buildSolution(piecesRemaining - 1); 
        
        board.togglePiece(rowIndex, colIndex);
      }
    }
    
  };
  for (var i = 0; i < n; i++) {
    board = new Board({n: n});
    board.togglePiece(0, i);
    buildSolution(n - 1);
  }

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

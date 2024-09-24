// Shape public function ====================================================================================
function computeFormula(formula, aryCoordset, width, height) {
	// Formula separation.
	var aryTerm = formula.split(/[@\(\):_]/);

	// w / h / x / y value substituted.
	for (loop = 1; loop < aryTerm.length; loop++) {
		switch (aryTerm[loop]) {
			case "w":
				aryTerm[loop - 1] = eval(aryTerm[loop - 1]) / 100.0 * width;
				aryTerm[loop] = "";
				break;
			case "h":
				aryTerm[loop - 1] = eval(aryTerm[loop - 1]) / 100.0 * height;
				aryTerm[loop] = "";
				break;
			case "x":
				for (index = 0; index < aryCoordset.length && aryCoordset[index].length > 0; index++) {
					var aryCoord = new String(aryCoordset[index]).split(",");
					if (aryTerm[loop - 1] == aryCoord[0]) {
						aryTerm[loop - 1] = eval(aryCoord[1]) / 100.0 * width;
						aryTerm[loop] = "";
						break;
					}
				}
				break;
			case "y":
				for (index = 0; index < aryCoordset.length && aryCoordset[index].length > 0; index++) {
					var aryCoord = new String(aryCoordset[index]).split(",");
					if (aryTerm[loop - 1] == aryCoord[0]) {
						aryTerm[loop - 1] = eval(aryCoord[2]) / 100.0 * height;
						aryTerm[loop] = "";
						break;
					}
				}
				break;
		}
	}
	// Space arrangement deleted.
	for (loop = aryTerm.length - 1; loop >= 0; loop--) {
		if (aryTerm[loop] == "")
			aryTerm.splice(loop, 1);
	}

	// min / max value substituted.
	for (loop = 1; loop < aryTerm.length; loop++) {
		switch (aryTerm[loop]) {
			case "min":
				aryTerm[loop] = Math.min(aryTerm[loop + 1], aryTerm[loop + 2]);
				aryTerm.splice(loop + 1, 2);
				break;
			case "max":
				aryTerm[loop] = Math.max(aryTerm[loop + 1], aryTerm[loop + 2]);
				aryTerm.splice(loop + 1, 2);
				break;
		}
	}

	// Last value calculated.
	var result = aryTerm[aryTerm.length - 1];
	for (loop = aryTerm.length - 2; loop >= 0; loop--) {
		result *= eval(aryTerm[loop]) / 100.0;
	}

	return result;
}

function getCoordValue(aryCoordset, typeid, defaultX, defaultY, width, height) {
	var rtnCoord = {}; rtnCoord.typeid = rtnCoord.curX = rtnCoord.curY = rtnCoord.minX = rtnCoord.minY = rtnCoord.maxX = rtnCoord.maxY = "";
	rtnCoord.curX = (new String(defaultX).search(/[a-z]/) == -1) ? (eval(defaultX) / 100.0) : (defaultX);
	rtnCoord.curY = (new String(defaultY).search(/[a-z]/) == -1) ? (eval(defaultY) / 100.0) : (defaultY);

	if ((aryCoordset == null) || (typeid == ""))
		return rtnCoord;   // It returns the initialized obj.

	// 1. Find a matching dataset.
	for (loop = 0; loop < aryCoordset.length && aryCoordset[loop].length > 0; loop++) {
		var aryCoord = new String(aryCoordset[loop]).split(",");
		if ((aryCoord.length == 7) && (aryCoord[0] == typeid)) {
			rtnCoord.typeid = aryCoord[0];
			rtnCoord.curX = aryCoord[1];
			rtnCoord.curY = aryCoord[2];
			rtnCoord.minX = aryCoord[3];
			rtnCoord.minY = aryCoord[4];
			rtnCoord.maxX = aryCoord[5];
			rtnCoord.maxY = aryCoord[6];
			break;
		}
	}
	// If there is no matching data sets to return the initial state.
	if (rtnCoord.typeid == "" || rtnCoord.curX == "" || rtnCoord.curY == "" || rtnCoord.minX == "" || rtnCoord.minY == "" || rtnCoord.maxX == "" || rtnCoord.maxY == "")
		return rtnCoord;   // It returns the initialized obj.

	// 2. replacing the reference value of rtnCoord.
	for (loop = 0; loop < aryCoordset.length && aryCoordset[loop].length > 0; loop++) {
		var aryCoord = new String(aryCoordset[loop]).split(",");
		if (aryCoord.length == 7) {
			if (aryCoord[0] != "") {
				if ((aryCoord[1] != "") && (aryCoord[1].search(/[a-z]/) == -1)) {
					if (rtnCoord.curX.search("@") == -1)
						rtnCoord.curX = rtnCoord.curX.replace(aryCoord[0], aryCoord[1]);
					if (rtnCoord.minX.search("@") == -1)
						rtnCoord.minX = rtnCoord.minX.replace(aryCoord[0], aryCoord[1]);
					if (rtnCoord.maxX.search("@") == -1)
						rtnCoord.maxX = rtnCoord.maxX.replace(aryCoord[0], aryCoord[1]);
				}
				if ((aryCoord[2] != "") && (aryCoord[2].search(/[a-z]/) == -1)) {
					if (rtnCoord.curY.search("@") == -1)
						rtnCoord.curY = rtnCoord.curY.replace(aryCoord[0], aryCoord[2]);
					if (rtnCoord.minY.search("@") == -1)
						rtnCoord.minY = rtnCoord.minY.replace(aryCoord[0], aryCoord[2]);
					if (rtnCoord.maxY.search("@") == -1)
						rtnCoord.maxY = rtnCoord.maxY.replace(aryCoord[0], aryCoord[2]);
				}
			}
		} else
			alert("Invalid : unmatch parameter count in diagramcoords.");
	}

	// 3. Calculate the representation of formula rtnCoord.
	if (rtnCoord.curX.search("@") != -1)
		rtnCoord.curX = new String(computeFormula(rtnCoord.curX, aryCoordset, width, height) / width * 100);
	if (rtnCoord.curY.search("@") != -1)
		rtnCoord.curY = new String(computeFormula(rtnCoord.curY, aryCoordset, width, height) / height * 100);
	if (rtnCoord.minX.search("@") != -1)
		rtnCoord.minX = new String(computeFormula(rtnCoord.minX, aryCoordset, width, height) / width * 100);
	if (rtnCoord.minY.search("@") != -1)
		rtnCoord.minY = new String(computeFormula(rtnCoord.minY, aryCoordset, width, height) / height * 100);
	if (rtnCoord.maxX.search("@") != -1)
		rtnCoord.maxX = new String(computeFormula(rtnCoord.maxX, aryCoordset, width, height) / width * 100);
	if (rtnCoord.maxY.search("@") != -1)
		rtnCoord.maxY = new String(computeFormula(rtnCoord.maxY, aryCoordset, width, height) / height * 100);

	// 4. converts the character data of the number rtnCoord data. (Including simple calculation process by eval ())
	rtnCoord.curX = eval(rtnCoord.curX.replace(/[^-\+\*\/\.0-9]/g, '')) / 100.0;
	rtnCoord.curY = eval(rtnCoord.curY.replace(/[^-\+\*\/\.0-9]/g, '')) / 100.0;
	rtnCoord.minX = eval(rtnCoord.minX.replace(/[^-\+\*\/\.0-9]/g, '')) / 100.0;
	rtnCoord.minY = eval(rtnCoord.minY.replace(/[^-\+\*\/\.0-9]/g, '')) / 100.0;
	rtnCoord.maxX = eval(rtnCoord.maxX.replace(/[^-\+\*\/\.0-9]/g, '')) / 100.0;
	rtnCoord.maxY = eval(rtnCoord.maxY.replace(/[^-\+\*\/\.0-9]/g, '')) / 100.0;

	// 5. converts the data in the effective range of rtnCoord.
	rtnCoord.minX = Math.max(Math.min(rtnCoord.minX, 1.0), 0.0);
	rtnCoord.minY = Math.max(Math.min(rtnCoord.minY, 1.0), 0.0);
	rtnCoord.maxX = Math.max(Math.min(rtnCoord.maxX, 1.0), 0.0);
	rtnCoord.maxY = Math.max(Math.min(rtnCoord.maxY, 1.0), 0.0);
	rtnCoord.curX = Math.max(Math.min(rtnCoord.curX, rtnCoord.maxX), rtnCoord.minX);
	rtnCoord.curY = Math.max(Math.min(rtnCoord.curY, rtnCoord.maxY), rtnCoord.minY);

	return rtnCoord;
}

function adjVal(curVal, drawVal, maxVal) {
	var minVal = parseInt(drawVal / 3) + 1;
	return (Math.min(Math.max(curVal, minVal), (maxVal - minVal)));
}

	function same_X(p1, p2, border, width) {
	if (adjVal(width * p1.curX, border, width) == adjVal(width * p2.curX, border, width))
		return true;
	return false;
}

function same_Y(p1, p2, border, height) {
	if (adjVal(height * p1.curY, border, height) == adjVal(height * p2.curY, border, height))
		return true;
	return false;
}

function same_XY(p1, p2, border, width, height) {
	if (same_X(p1, p2, border, width) && same_Y(p1, p2, border, height))
		return true;
	return false;
}

function same_x(x1, x2, border, width) {
	if (adjVal(width * x1, border, width) == adjVal(width * x2, border, width))
		return true;
	return false;
}

function same_y(y1, y2, border, height) {
	if (adjVal(height * y1, border, height) == adjVal(height * y2, border, height))
		return true;
	return false;
}

function same_xy(x1, y1, x2, y2, border, width, height) {
	if (same_x(x1, x2, border, width) && same_y(y1, y2, border, height))
		return true;
	return false;
}

function same_CP(p1, p2, border, width, height) {
	if ((adjVal(width * p1.px, border, width) == adjVal(width * p2.px, border, width)) &&
		(adjVal(height * p1.py, border, height) == adjVal(height * p2.py, border, height)))
		return true;
	return false;
}

function pathCloseAndFinish(ctx, fw, bw) {
	ctx.closePath();
	ctx.mozDash = [fw, bw];
	if (!ctx.setLineDash) {
		ctx.setLineDash = function () { }
	} else {
		ctx.setLineDash([fw, bw]); //safari "undefined function"
	}
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

function pathCloseAndContinue(ctx, fw, bw) {
	ctx.closePath();
	ctx.mozDash = [fw, bw];
	if (!ctx.setLineDash) {
		ctx.setLineDash = function () { }
	} else {
		ctx.setLineDash([fw, bw]); //safari "undefined function"
	}
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
}

function pathStrokeAndContinue(ctx, fw, bw) {
	ctx.mozDash = [fw, bw];
	if (!ctx.setLineDash) {
		ctx.setLineDash = function () { }
	} else {
		ctx.setLineDash([fw, bw]); //safari "undefined function"
	}
	ctx.stroke();
	ctx.beginPath();
}

function getDrawColor(color, mode) {
	var colors = color.replace(/[^-\.\,0-9]/g, '').split(',');
	if (colors.length < 4) colors[3] = '1';
	var colorWeight, alphaWeight;
	switch (mode) {
		case 'superlight':  colorWeight = 1.085;    alphaWeight = 1.0;  break;
		case 'light':       colorWeight = 1.075;    alphaWeight = 1.0;  break;
		case 'dark':        colorWeight = 0.85;     alphaWeight = 1.0;  break;
		case 'deepdark':    colorWeight = 0.75;     alphaWeight = 1.0;  break;
		case 'transparency':colorWeight = 1.0;      alphaWeight = 0.0;  break;

		case 'random':
			colors[0] = Math.round(Math.random() * 255);
			colors[1] = Math.round(Math.random() * 255);
			colors[2] = Math.round(Math.random() * 255);
			// continue;
		case 'normal':
		default:            colorWeight = 1.0;      alphaWeight = 1.0;  break;
	}
	var rColor = Math.round(Math.min(Math.max(eval(colors[0]) * colorWeight, 0), 255));
	var gColor = Math.round(Math.min(Math.max(eval(colors[1]) * colorWeight, 0), 255));
	var bColor = Math.round(Math.min(Math.max(eval(colors[2]) * colorWeight, 0), 255));
	var aColor = eval(colors[3]) * alphaWeight;
	var newColor = 'rgba(' + rColor + ',' + gColor + ',' + bColor + ',' + aColor + ')';
	return newColor;
}

function setDrawColor(ctx, border, borderColor, fillColor, mode, apply) {
	switch (mode) {
		case 'superlight':
		case 'light':
		case 'normal':
		case 'dark':
		case 'deepdark':
			ctx.strokeStyle = 'rgba(0,0,0,0)';
			setGradient(ctx, null, getDrawColor(fillColor, mode), apply);
			break;

		case 'null':        // If transparent border only
			ctx.strokeStyle = borderColor;
			ctx.fillStyle = 'rgba(0,0,0,0)';
			break;

		case 'transparent': // Only the dotted line
			ctx.strokeStyle = borderColor.replace(",1)", ",0.5)");  //alpha
			ctx.fillStyle = 'rgba(0,0,0,0)';
			if (!ctx.setLineDash) {
				ctx.setLineDash = function () { }
			} else {
				ctx.setLineDash([border * 2, border]);
			}
			break;

		case 'original':    // Both the surface and borders set
		case 'standard':
		default:
			ctx.strokeStyle = borderColor;
			setGradient(ctx, null, fillColor, apply);
			break;
	}
}

// Line shape function ====================================================================================
function drawLine(ctx, width, height, aryCoordset, border, lineHead, lineTail, weight, dash, fw, bw, apply) {
	// - construction
	ctx.moveTo(adjVal(0, border, width), adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width, border, width), adjVal(height / 2, border, height));
	pathStrokeAndContinue(ctx, fw,bw);
	
	switch(lineHead) {
		case 'wings':
			// > construction
			ctx.moveTo(adjVal(width - (border * 3 + (border * weight)), border, width), adjVal((height * 0.5) - (border * 1.5 + (border * weight)), border, height));
			ctx.lineTo(adjVal(width, border, width), adjVal(height / 2, border, height));
			ctx.lineTo(adjVal((width) - (border * 3 + (border * weight)), border, width), adjVal((height * 0.5) + (border * 1.5 + (border * weight)), border, height));
			pathStrokeAndContinue(ctx, fw,bw);
			break;
		case 'diamond' :
			// <> construction
			ctx.moveTo(adjVal(width - (border * 1.5 + (border * weight)), border, width), adjVal((height / 2) - ((border * 1) + (border  * weight)), border, height));
			ctx.lineTo(adjVal(width - ((border * 1.5 + (border * weight)) * 2), border, width), adjVal(height / 2, border, height));
			ctx.lineTo(adjVal(width - (border * 1.5 + (border * weight)), border, width), adjVal((height / 2) + ((border * 1) + (border  * weight)), border, height));
			ctx.lineTo(adjVal(width, border, width), adjVal(height / 2, border, height));
			pathCloseAndContinue(ctx, fw, bw);
			break;
		case 'circle' :
			var xCenter = width - (border * 1.5 + (border * weight));
			var yCenter = height * 0.5;
			var radius = border * 1 + (border * weight);
			
			// () construction
			ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2);
			pathCloseAndContinue(ctx, fw, bw);
			break;
	}
	
	switch(lineTail) {
		case 'wings':
			// < construction
			ctx.moveTo(adjVal(border * 3 + (border * weight), border, width), adjVal((height * 0.5) - (border * 1.5 + (border * weight)), border, height));
			ctx.lineTo(adjVal(0, border, width), adjVal(height * 0.5, border, height));
			ctx.lineTo(adjVal(border * 3 + (border * weight), border, width), adjVal((height * 0.5) + (border * 1.5 + (border * weight)), border, height));
			pathStrokeAndContinue(ctx, fw,bw);
			break;
		case 'diamond' :
			// <> construction
			ctx.moveTo(adjVal(border * 1.5 + (border * weight), border, width), adjVal((height / 2) - (border * 1.5 + (border  * weight)), border, height));
			ctx.lineTo(adjVal((border * 1.5 + (border * weight)) * 2, border, width), adjVal(height / 2, border, height));
			ctx.lineTo(adjVal((border * 1.5 + (border  * weight)), border, width), adjVal((height / 2) + (border * 1.5 + (border  * weight)), border, height));
			ctx.lineTo(adjVal(0, border, width), adjVal(height / 2, border, height));
			pathCloseAndContinue(ctx, fw, bw);
			break;
		case 'circle' :
			var xCenter = border * 1.5 + (border * weight);
			var yCenter = height * 0.5;
			var radius = border + (border * weight);

			// () construction
			ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2);
			pathCloseAndContinue(ctx, fw, bw);
			break;
	}
}

function drawTurn(ctx, width, height, aryCoordset, border, lineHead, lineTail, weight, dash, fw, bw, apply){
	var s1 = getCoordValue(aryCoordset, "s1", "0", "25", width, height);        //starting point : "S1, 0,25, 0,0, 0,75"
	var e1 = getCoordValue(aryCoordset, "e1", "75", "100", width, height);    //Endpoint : "E1, 75,100, 25,100, 100,100"

	// ┐construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),      adjVal(height * s1.curY, border, height));
	ctx.lineTo(adjVal(width * e1.curX, border, width),      adjVal(height * s1.curY, border, height));

	if (!same_XY(s1, e1, border, width, height))
		ctx.lineTo(adjVal(width * e1.curX, border, width),  adjVal(height * e1.curY, border, height));;
	
	pathStrokeAndContinue(ctx, fw,bw);
	switch(lineHead) {
		case 'wings':
			// V construction
			ctx.moveTo(adjVal((width * e1.curX) - (border * 1.5 + (weight * border)), border, width), adjVal(height - (border * 3 + (weight * border)), border, height));
			ctx.lineTo(adjVal(width * e1.curX, border, width), adjVal(height, border, height));
			ctx.lineTo(adjVal((width * e1.curX) + (border * 1.5 + (weight * border)), border, width), adjVal(height - (border * 3 + (weight * border)), border, height));
			pathStrokeAndContinue(ctx, fw,bw);
			break;
		case 'diamond' :
			// <> construction
			ctx.moveTo(adjVal((width * e1.curX), border, width), adjVal(height - ((border * 1.5 + (border * weight)) * 2), border, height));
			ctx.lineTo(adjVal((width * e1.curX) - (border * 1.5 + (border * weight)), border, width), adjVal(height - (border * 1.5 + (border * weight)), border, height));
			ctx.lineTo(adjVal((width * e1.curX), border, width), adjVal(height, border, height));
			ctx.lineTo(adjVal((width * e1.curX) + (border * 1.5 + (border * weight)), border, width), adjVal(height - (border * 1.5 + (border * weight)), border, height));
			pathCloseAndContinue(ctx, fw, bw);
			break;
		case 'circle' :
			var xCenter = (width * e1.curX);
			var yCenter = height - (border * 1.5 + (border * weight));
			var radius = border + (border * weight);


			// () construction
			ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2);
			pathCloseAndContinue(ctx, fw, bw);
			break;

	}
	
	switch(lineTail) {
		case 'wings':
			// < construction
			ctx.moveTo(adjVal(border * 3 + (border * weight), border, width * (e1.curX)), adjVal((height * s1.curY) - (border * 1.5 + (border * weight)), border, height));
			ctx.lineTo(adjVal(0, border, width), adjVal(height * s1.curY, border, height));
			ctx.lineTo(adjVal(border * 3 + (border * weight), border, width * (e1.curX)), adjVal((height * s1.curY) + (border * 1.5 + (border * weight)), border, height));
			pathStrokeAndContinue(ctx, fw,bw);
			break;
		case 'diamond':
			ctx.moveTo(adjVal(border * 1.5 + (border * weight), border, width), adjVal((height * s1.curY) - (border * 1.5 + (border * weight)), border, height));
			ctx.lineTo(adjVal(0, border, width), adjVal(height * s1.curY, border, height));
			ctx.lineTo(adjVal(border * 1.5 + (border * weight), border, width), adjVal((height * s1.curY) + (border * 1.5 + (border * weight)), border, height));
			ctx.lineTo(adjVal(((border * 1.5 + (border * weight)) * 2), border, width), adjVal(height * s1.curY, border, height));		
			pathCloseAndContinue(ctx, fw, bw);
			break;
		case 'circle' :			
			var xCenter = border * 1.5 + (border * weight);
			var yCenter = height * s1.curY;
			var radius = border + (border * weight);

			// () construction
			ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2);
			pathCloseAndContinue(ctx, fw, bw);
			break;
	}

}

function drawTurn2(ctx, width, height, aryCoordset, border, lineHead, lineTail, weight, dash, fw, bw, apply){
	var s1 = getCoordValue(aryCoordset, "s1", "0", "0", width, height);        //starting point : "S1, 0,0, 0,0, 0,100"
	var e1 = getCoordValue(aryCoordset, "e1", "100", "100", width, height);    //Endpoint : "E1, 100,100, 100,0, 100,100"
	var c1 = getCoordValue(aryCoordset, "c1", "50", "50", width, height);      //Crack line : "C1, 50,50, 0,50, 100,50"

	// ┐_ construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),          adjVal(height * s1.curY, border, height));
	if (!same_X(s1, c1, border, width))
		ctx.lineTo(adjVal(width * c1.curX, border, width),      adjVal(height * s1.curY, border, height));
	else
		ctx.moveTo(adjVal(width * c1.curX, border, width),      adjVal(height * s1.curY, border, height));
	ctx.lineTo(adjVal(width * c1.curX, border, width),          adjVal(height * e1.curY, border, height));
	if (!same_X(e1, c1, border, width))
		ctx.lineTo(adjVal(width * e1.curX, border, width),      adjVal(height * e1.curY, border, height));
	pathStrokeAndContinue(ctx, fw,bw);
	
	switch(lineHead) {
		case 'wings':
			// > construction
			ctx.moveTo(adjVal(width - (border * 3 + (border * weight)), border, width), adjVal((height * e1.curY) - (border * 1.5 + (border * weight)), border, height));
			ctx.lineTo(adjVal(width, border, width), adjVal(height * e1.curY, border, height));
			ctx.lineTo(adjVal((width) - (border * 3 + (border * weight)), border, width), adjVal((height * e1.curY) + (border * 1.5 + (border * weight)), border, height));
			pathStrokeAndContinue(ctx, fw,bw);
			break;
		case 'diamond' :
			// <> construction
			ctx.moveTo(adjVal(width - (border * 1.5 + (border  * weight)), border, width), adjVal((height * e1.curY) - (border * 1.5 + (border  * weight)), border, height));
			ctx.lineTo(adjVal(width - ((border * 1.5 + (border  * weight)) * 2), border, width), adjVal((height * e1.curY), border, height));
			ctx.lineTo(adjVal(width - (border * 1.5 + (border  * weight)), border, width), adjVal((height * e1.curY) + (border * 1.5 + (border  * weight)), border, height));
			ctx.lineTo(adjVal(width, border, width), adjVal((height * e1.curY), border, height));
			pathCloseAndContinue(ctx, fw, bw);
			break;
		case 'circle' :
			var xCenter = width - (border * 1.5 + (border * weight));
			var yCenter = (height * e1.curY);
			var radius = border + (border * weight);
			
			// () construction
			ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2);
			pathCloseAndContinue(ctx, fw, bw);
			break;
	}
	
	switch(lineTail) {
		case 'wings':
			// < construction
			ctx.moveTo(adjVal(border * 3 + (border * weight), border, width), adjVal((height * s1.curY) - (border * 1.5 + (border * weight)), border, height));
			ctx.lineTo(adjVal(0, border, width), adjVal(height * s1.curY, border, height));
			ctx.lineTo(adjVal(border * 3 + (border * weight), border, width), adjVal((height * s1.curY) + (border * 1.5 + (border * weight)), border, height));
			pathStrokeAndContinue(ctx, fw,bw);
			break;
		case 'diamond' :
			// <> construction
			ctx.moveTo(adjVal((border * 1.5 + (border  * weight)), border, width), adjVal((height * s1.curY) - (border * 1.5 + (border  * weight)), border, height));
			ctx.lineTo(adjVal(((border * 1.5 + (border  * weight)) * 2), border, width), adjVal((height * s1.curY), border, height));
			ctx.lineTo(adjVal((border * 1.5 + (border  * weight)), border, width), adjVal((height * s1.curY) + (border * 1.5 + (border  * weight)), border, height));
			ctx.lineTo(adjVal(0, border, width), adjVal((height * s1.curY), border, height));
			pathCloseAndContinue(ctx, fw, bw);
			break;
		case 'circle' :
			var xCenter = border * 1.5 + (border * weight);
			var yCenter = (height * s1.curY);
			var radius = border + (border * weight);

			// () construction
			ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2);
			pathCloseAndContinue(ctx, fw, bw);
			break;
	}
}

function drawLineNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var s1 = getCoordValue(aryCoordset, "s1", "0", "50", width, height);   //starting point : "S1, 0,50, 0,0, 0,100"
	var e1 = getCoordValue(aryCoordset, "e1", "100", "50", width, height); //Endpoint : "E1, 100,50, 100,0, 100,100"

	// - construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),  adjVal(height * s1.curY, border, height));
	ctx.lineTo(adjVal(width * e1.curX, border, width),  adjVal(height * e1.curY, border, height));
}

function drawLineSingleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var w1 = getCoordValue(aryCoordset, "w1", "75", "0", width, height);    //Wings Point : "W1, 75,0, 0,0, 100,0"

	// - construction
	ctx.moveTo(adjVal(0, border, width),                adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width, border, width),            adjVal(height / 2, border, height));

	// > construction
	ctx.moveTo(adjVal(width * w1.curX, border, width),  adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width),            adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),  adjVal(height, border, height));
}

function drawLineDoubleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var w1 = getCoordValue(aryCoordset, "w1", "25", "0", width, height);    //Wings Point : "W1, 25,0, 0,0, 50,0"

	// - construction
	ctx.moveTo(adjVal(0, border, width),                        adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(height / 2, border, height));

	// < construction
	ctx.moveTo(adjVal(width * w1.curX, border, width),          adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),          adjVal(height, border, height));

	// > construction
	ctx.moveTo(adjVal(width * (1 - w1.curX), border, width),    adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width * (1 - w1.curX), border, width),    adjVal(height, border, height));
}

function drawLineTurnNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var s1 = getCoordValue(aryCoordset, "s1", "0", "0", width, height);        //starting point : "S1, 0,0, 0,0, 0,100"
	var e1 = getCoordValue(aryCoordset, "e1", "100", "100", width, height);    //Endpoint : "E1, 100,100, 0,100, 100,100"
	var v1 = getCoordValue(aryCoordset, "v1", "100", "0", width, height);      //vertex : "V1, 100,0, 0,0, 100,100"

	// ┐construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),      adjVal(height * s1.curY, border, height));
	ctx.lineTo(adjVal(width * v1.curX, border, width),      adjVal(height * v1.curY, border, height));
	if (!same_XY(s1, e1, border, width, height))
		ctx.lineTo(adjVal(width * e1.curX, border, width),  adjVal(height * e1.curY, border, height));
}

function drawLineTurnSingleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var s1 = getCoordValue(aryCoordset, "s1", "0", "0", width, height);        //starting point : "S1, 0,0, 0,0, 0,100"
	var a1 = getCoordValue(aryCoordset, "a1", "75", "100", width, height);     //Arrows point : "A1, 75,100, 50,100, 100,100"
	var w1 = getCoordValue(aryCoordset, "w1", "100", "75", width, height);     //Wings Point : "W1, 100,75, 100,0, 100,100"

	// ┐construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),      adjVal(height * s1.curY, border, height));
	ctx.lineTo(adjVal(width * a1.curX, border, width),      adjVal(0, border, height));
	ctx.lineTo(adjVal(width * a1.curX, border, width),      adjVal(height * a1.curY, border, height));

	// V construction
	ctx.moveTo(adjVal(width * (1 - ((1 - a1.curX) * 2)), border, width),    adjVal(height * w1.curY, border, height));
	ctx.lineTo(adjVal(width * a1.curX, border, width),                      adjVal(height, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),                      adjVal(height * w1.curY, border, height));
}

function drawLineTurnDoubleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var a1 = getCoordValue(aryCoordset, "a1", "0", "25", width, height);       //Arrows point1 : "A1, 0,25, 0,0, 0,50"
	var w1 = getCoordValue(aryCoordset, "w1", "25", "0", width, height);       //Wings Point1 : "W1, 25,0, 0,0, 50,0"
	var a2 = getCoordValue(aryCoordset, "a2", "75", "100", width, height);     //Arrows point2 : "A2, 75,100, 50,100, 100,100"
	var w2 = getCoordValue(aryCoordset, "w2", "100", "75", width, height);     //Wings Point2 : "W2, 100,75, 100,50, 100,100"

	// ┐construction
	ctx.moveTo(adjVal(width * a1.curX, border, width),      adjVal(height * a1.curY, border, height));
	ctx.lineTo(adjVal(width * a2.curX, border, width),      adjVal(height * a1.curY, border, height));
	ctx.lineTo(adjVal(width * a2.curX, border, width),      adjVal(height * a2.curY, border, height));

	// < construction
	ctx.moveTo(adjVal(width * w1.curX, border, width),      adjVal(height * w1.curY, border, height));
	ctx.lineTo(adjVal(width * a1.curX, border, width),      adjVal(height * a1.curY, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),      adjVal(height * (a1.curY * 2), border, height));

	// V construction
	ctx.moveTo(adjVal(width * (1 - ((1 - a2.curX) * 2)), border, width),    adjVal(height * w2.curY, border, height));
	ctx.lineTo(adjVal(width * a2.curX, border, width),                      adjVal(height, border, height));
	ctx.lineTo(adjVal(width * w2.curX, border, width),                      adjVal(height * w2.curY, border, height));
}

function drawLine2TurnNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var s1 = getCoordValue(aryCoordset, "s1", "0", "0", width, height);        //starting point : "S1, 0,0, 0,0, 0,100"
	var e1 = getCoordValue(aryCoordset, "e1", "100", "100", width, height);    //Endpoint : "E1, 100,100, 100,0, 100,100"
	var c1 = getCoordValue(aryCoordset, "c1", "50", "50", width, height);      //Crack line : "C1, 50,50, 0,50, 100,50"

	// ┐_ construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),          adjVal(height * s1.curY, border, height));
	if (!same_X(s1, c1, border, width))
		ctx.lineTo(adjVal(width * c1.curX, border, width),      adjVal(0, border, height));
	else
		ctx.moveTo(adjVal(width * c1.curX, border, width),      adjVal(0, border, height));
	ctx.lineTo(adjVal(width * c1.curX, border, width),          adjVal(height, border, height));
	if (!same_X(e1, c1, border, width))
		ctx.lineTo(adjVal(width * e1.curX, border, width),      adjVal(height * e1.curY, border, height));
}

function drawLine2TurnSingleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var s1 = getCoordValue(aryCoordset, "s1", "0", "0", width, height);        //starting point : "S1, 0,0, 0,0, 0,100"
	var a1 = getCoordValue(aryCoordset, "a1", "100", "75", width, height);     //Arrows point : "A1, 100,75, 100,50, 100,100"
	var w1 = getCoordValue(aryCoordset, "w1", "75", "100", width, height);     //Wings Point : "W1, 75,100, 50,100, 100,100"
	var c1 = getCoordValue(aryCoordset, "c1", "50", "50", width, height);      //Crack line : "C1, 50,50, 0,50, 100,50"

	// ┐_ construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),          adjVal(height * s1.curY, border, height));
	if (!same_X(s1, c1, border, width))
		ctx.lineTo(adjVal(width * c1.curX, border, width),      adjVal(0, border, height));
	else {
		if (adjVal(height * s1.curY, border, height) > adjVal(height * a1.curY, border, height))
			ctx.lineTo(adjVal(width * c1.curX, border, width),  adjVal(height * a1.curY, border, height));
		ctx.moveTo(adjVal(width * c1.curX, border, width),      adjVal(0, border, height));
	}
	ctx.lineTo(adjVal(width * c1.curX, border, width),          adjVal(height * a1.curY, border, height));
	ctx.lineTo(adjVal(width * a1.curX, border, width),          adjVal(height * a1.curY, border, height));

	// > construction
	ctx.moveTo(adjVal(width * w1.curX, border, width),          adjVal(height * (1 - ((1 - a1.curY) * 2)), border, height));
	ctx.lineTo(adjVal(width * a1.curX, border, width),          adjVal(height * a1.curY, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),          adjVal(height * w1.curY, border, height));
}

function drawLine2TurnDoubleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var a1 = getCoordValue(aryCoordset, "a1", "0", "25", width, height);       //Arrows point : "A1, 0,25, 0,0, 0,50"
	var w1 = getCoordValue(aryCoordset, "w1", "25", "0", width, height);       //Wings Point : "W1, 25,0, 0,0, 50,0"
	var c1 = getCoordValue(aryCoordset, "c1", "50", "50", width, height);      //Crack line : "C1, 50,50, 0,50, 100,50"

	// ┐_ construction
	ctx.moveTo(adjVal(width * a1.curX, border, width),          adjVal(height * a1.curY, border, height));
	ctx.lineTo(adjVal(width * c1.curX, border, width),          adjVal(height * a1.curY, border, height));
	ctx.lineTo(adjVal(width * c1.curX, border, width),          adjVal(height * (1 - a1.curY), border, height));
	ctx.lineTo(adjVal(width * (1 - a1.curX), border, width),    adjVal(height * (1 - a1.curY), border, height));

	// < construction
	ctx.moveTo(adjVal(width * w1.curX, border, width),          adjVal(height * w1.curY, border, height));
	ctx.lineTo(adjVal(width * a1.curX, border, width),          adjVal(height * a1.curY, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),          adjVal(height * (a1.curY * 2), border, height));

	// > construction
	ctx.moveTo(adjVal(width * (1 - w1.curX), border, width),    adjVal(height * (1 - (a1.curY * 2)), border, height));
	ctx.lineTo(adjVal(width * (1 - a1.curX), border, width),    adjVal(height * (1 - a1.curY), border, height));
	ctx.lineTo(adjVal(width * (1 - w1.curX), border, width),    adjVal(height * (1 - w1.curY), border, height));
}

function drawLineUnderNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var s1 = getCoordValue(aryCoordset, "s1", "100", "0", width, height);       //starting point : "S1, 100,0, 100,0, 100,E1"
	var e1 = getCoordValue(aryCoordset, "e1", "100", "100", width, height);     //Endpoint : "E1, 100,100, 100,S1, 100,100"
	var v1 = getCoordValue(aryCoordset, "v1", "0", "50", width, height);        //vertex : "V1, 0,50, 0,0, 0,100"

	// < construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),      adjVal(height * s1.curY, border, height));
	ctx.lineTo(adjVal(width * v1.curX, border, width),      adjVal(height * v1.curY, border, height));
	if (!same_XY(s1, e1, border, width, height))
		ctx.lineTo(adjVal(width * e1.curX, border, width),  adjVal(height * e1.curY, border, height));
}

function drawLineOverNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var s1 = getCoordValue(aryCoordset, "s1", "0", "0", width, height);         //starting point : "S1, 0,0, 0,0, 0,E1"
	var e1 = getCoordValue(aryCoordset, "e1", "0", "100", width, height);       //Endpoint : "E1, 0,100, 0,S1, 0,100"
	var v1 = getCoordValue(aryCoordset, "v1", "100", "50", width, height);      //vertex : "V1, 100,50, 100,0, 100,100"

	// > construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),      adjVal(height * s1.curY, border, height));
	ctx.lineTo(adjVal(width * v1.curX, border, width),      adjVal(height * v1.curY, border, height));
	if (!same_XY(s1, e1, border, width, height))
		ctx.lineTo(adjVal(width * e1.curX, border, width),  adjVal(height * e1.curY, border, height));
}

function drawLineBezier1NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var s1 = getCoordValue(aryCoordset, "s1", "0", "100", width, height);       //starting point : "S1, 0,100, 0,0, 100,100"
	var e1 = getCoordValue(aryCoordset, "e1", "100", "0", width, height);       //Endpoint : "E1, 100,0, 0,0, 100,100"
	var b1 = getCoordValue(aryCoordset, "b1", "100", "100", width, height);     //Bezier : "B1, 100,100, 0,0, 100,100"

	// If the virtual construction has Bezier displayed by a dotted line connecting the points
	if (apply == false) {
		var org = {};
		org.strokeStyle = ctx.strokeStyle;
		org.fillStyle = ctx.fillStyle;
		org.lineWidth = ctx.lineWidth;

		ctx.strokeStyle = 'rgba(0,0,0,0.5)';
		ctx.fillStyle = 'rgba(0,0,0,0)';
		ctx.lineWidth = 1;

		ctx.moveTo(adjVal(width * s1.curX, border, width),      adjVal(height * s1.curY, border, height));
		ctx.lineTo(adjVal(width * b1.curX, border, width),      adjVal(height * b1.curY, border, height));
		ctx.lineTo(adjVal(width * e1.curX, border, width),      adjVal(height * e1.curY, border, height));
		pathStrokeAndContinue(ctx, 1, 1);

		ctx.strokeStyle = org.strokeStyle;
		ctx.fillStyle = org.fillStyle;
		ctx.lineWidth = org.lineWidth;
	}

	// J construction
	ctx.moveTo(adjVal(width * s1.curX, border, width),              adjVal(height * s1.curY, border, height));
	ctx.quadraticCurveTo(adjVal(width * b1.curX, border, width),    adjVal(height * b1.curY, border, height),       adjVal(width * e1.curX, border, width),     adjVal(height * e1.curY, border, height));
}

function drawLineBezier2NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var s1 = getCoordValue(aryCoordset, "s1", "0", "100", width, height);       //starting point : "S1, 0,100, 0,0, 100,100"
	var e1 = getCoordValue(aryCoordset, "e1", "100", "0", width, height);       //Endpoint : "E1, 100,0, 0,0, 100,100"
	var b1 = getCoordValue(aryCoordset, "b1", "25", "0", width, height);        //Bezier : "B1, 25,0, 0,0, 100,100"
	var b2 = getCoordValue(aryCoordset, "b2", "75", "100", width, height);      //Bezier : "B2, 75,100, 0,0, 100,100"

	// If the virtual construction has Bezier displayed by a dotted line connecting the points
	if (apply == false) {
		var org = {};
		org.strokeStyle = ctx.strokeStyle;
		org.fillStyle = ctx.fillStyle;
		org.lineWidth = ctx.lineWidth;

		ctx.strokeStyle = 'rgba(0,0,0,0.5)';
		ctx.fillStyle = 'rgba(0,0,0,0)';
		ctx.lineWidth = 1;

		ctx.moveTo(adjVal(width * s1.curX, border, width),      adjVal(height * s1.curY, border, height));
		ctx.lineTo(adjVal(width * b1.curX, border, width),      adjVal(height * b1.curY, border, height));
		ctx.lineTo(adjVal(width * b2.curX, border, width),      adjVal(height * b2.curY, border, height));
		ctx.lineTo(adjVal(width * e1.curX, border, width),      adjVal(height * e1.curY, border, height));
		pathStrokeAndContinue(ctx, 1, 1);

		ctx.strokeStyle = org.strokeStyle;
		ctx.fillStyle = org.fillStyle;
		ctx.lineWidth = org.lineWidth;
	}

	// S construction
	ctx.moveTo(adjVal(width * s1.curX, border, width), adjVal(height * s1.curY, border, height));
	ctx.bezierCurveTo(adjVal(width * b1.curX, border, width),   adjVal(height * b1.curY, border, height),   adjVal(width * b2.curX, border, width),     adjVal(height * b2.curY, border, height),   adjVal(width * e1.curX, border, width),     adjVal(height * e1.curY, border, height));
}

function drawLineParabolaNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, apply) {
	var f1 = getCoordValue(aryCoordset, "f1", "50", "100", width, height);       //Inflection point : "F1, 50,100, 50,0, 50,100"

	var yValue = adjVal(height * f1.curY, border, height);
	var yVirtual = (yValue - (height / 2)) * 2 + yValue;

	// U construction
	ctx.moveTo(adjVal(0, border, width),                            adjVal(height * (1 - f1.curY), border, height));
	ctx.quadraticCurveTo(adjVal(width * f1.curX, border, width),    yVirtual,   adjVal(width, border, width),   adjVal(height * (1 - f1.curY), border, height));
}

function drawLineOpenparenthesisNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "0", "25", ex, ey);       //Inflection point : "F1, 0,25, 0,0, 0,50"

	ctx.moveTo(adjVal(ex, border, ex),              adjVal(sy, border, ey));
	ctx.quadraticCurveTo(adjVal(sx, border, ex),    adjVal(sy, border, ey),                         adjVal(sx, border, ex),     adjVal(sy + (height * f1.curY), border, ey));
	ctx.lineTo(adjVal(sx, border, ex),              adjVal(ey - (height * f1.curY), border, ey));
	ctx.quadraticCurveTo(adjVal(sx, border, ex),    adjVal(ey, border, ey),                         adjVal(ex, border, ex),     adjVal(ey, border, ey));
}

function drawLineCloseparenthesisNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "100", "25", ex, ey);       //Inflection point : "F1, 100,25, 100,0, 100,50"

	ctx.moveTo(adjVal(sx, border, ex),              adjVal(sy, border, ey));
	ctx.quadraticCurveTo(adjVal(ex, border, ex),    adjVal(sy, border, ey),                         adjVal(ex, border, ex),     adjVal(sy + (height * f1.curY), border, ey));
	ctx.lineTo(adjVal(ex, border, ex),              adjVal(ey - (height * f1.curY), border, ey));
	ctx.quadraticCurveTo(adjVal(ex, border, ex),    adjVal(ey, border, ey),                         adjVal(sx, border, ex),     adjVal(ey, border, ey));
}

function drawLineDoubleparenthesisNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var d1 = getCoordValue(aryCoordset, "d1", "25", "0", ex, ey);       //Thickness point : "D1, 25,0, 0,0, 50,0"
	var f1 = getCoordValue(aryCoordset, "f1", "0", "25", ex, ey);       //Inflection point : "F1, 0,25, 0,0, 0,50"

	var objWidth = width * d1.curX + border;

	drawLineOpenparenthesisNoneArrow(ctx, sx, sy, sx + objWidth, ey, aryCoordset, border, dash, fw, bw, apply);
	pathStrokeAndContinue(ctx, fw, bw);
	drawLineCloseparenthesisNoneArrow(ctx, ex - objWidth, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply)
}

function drawLineOpenbraceNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "50", "25", ex, ey);      //Inflection point1 : "F1, 50,25, 50,0, 50,F2/2"
	var f2 = getCoordValue(aryCoordset, "f2", "0", "50", ex, ey);       //Inflection point2 : "F2, 0,50, 0,0, 0,50"

	ctx.moveTo(adjVal(ex, border, ex),                                  adjVal(sy, border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (width * f1.curX), border, ex),    adjVal(sy, border, ey),                                     adjVal(sx + (width * f1.curX), border, ex),     adjVal(sy + (height * f1.curY), border, ey));
	ctx.lineTo(adjVal(sx + (width * f1.curX), border, ex),              adjVal(sy + (height * (f2.curY - f1.curY)), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (width * f1.curX), border, ex),    adjVal(sy + (height * f2.curY), border, ey),                adjVal(sx, border, ex),                         adjVal(sy + (height * f2.curY), border, ey));

	ctx.quadraticCurveTo(adjVal(sx + (width * f1.curX), border, ex),    adjVal(sy + (height * f2.curY), border, ey),                adjVal(sx + (width * f1.curX), border, ex),     adjVal(sy + (height * (f2.curY + f1.curY)), border, ey));
	ctx.lineTo(adjVal(sx + (width * f1.curX), border, ex),              adjVal(ey - (height * f1.curY), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (width * f1.curX), border, ex),    adjVal(ey, border, ey),                                     adjVal(ex, border, ex),                         adjVal(ey, border, ey));
}

function drawLineClosebraceNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "50", "25", ex, ey);      //Inflection point1 : "F1, 50,25, 50,0, 50,F2/2"
	var f2 = getCoordValue(aryCoordset, "f2", "100", "50", ex, ey);     //Inflection point2 : "F2, 100,50, 100,0, 100,50"

	ctx.moveTo(adjVal(sx, border, ex),                                  adjVal(sy, border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (width * f1.curX), border, ex),    adjVal(sy, border, ey),                                     adjVal(sx + (width * f1.curX), border, ex),     adjVal(sy + (height * f1.curY), border, ey));
	ctx.lineTo(adjVal(sx + (width * f1.curX), border, ex),              adjVal(sy + (height * (f2.curY - f1.curY)), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (width * f1.curX), border, ex),    adjVal(sy + (height * f2.curY), border, ey),                adjVal(ex, border, ex),                         adjVal(sy + (height * f2.curY), border, ey));

	ctx.quadraticCurveTo(adjVal(sx + (width * f1.curX), border, ex),    adjVal(sy + (height * f2.curY), border, ey),                adjVal(sx + (width * f1.curX), border, ex),     adjVal(sy + (height * (f2.curY + f1.curY)), border, ey));
	ctx.lineTo(adjVal(sx + (width * f1.curX), border, ex),              adjVal(ey - (height * f1.curY), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (width * f1.curX), border, ex),    adjVal(ey, border, ey),                                     adjVal(sx, border, ex),                         adjVal(ey, border, ey));
}

function drawLineDoublebraceNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var d1 = getCoordValue(aryCoordset, "d1", "25", "0", ex, ey);       //Thickness point : "D1, 25,0, 0,0, 50,0"
	var f1 = getCoordValue(aryCoordset, "f1", "12.5", "25", ex, ey);    //Inflection point1 : "F1, 12.5,25, D1/2,0, D1/2,F2/2"
	var f2 = getCoordValue(aryCoordset, "f2", "0", "50", ex, ey);       //Inflection point2 : "F2, 0,50, 0,0, 0,50"

	var objWidth = width * d1.curX + border;
	var objF1X = width * f1.curX / objWidth * 100;
	var strCoordset = "F1, " + objF1X + "," + (f1.curY * 100) + ", " + objF1X + "," + (f1.minY * 100) + ", " + objF1X + "," + (f1.maxY * 100) + "; " + "F2, " + (f2.curX * 100) + "," + (f2.curY * 100) + ", " + (f2.minX * 100) + "," + (f2.minY * 100) + ", " + (f2.maxX * 100) + "," + (f2.maxY * 100) + ";";
	var objCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");

	drawLineOpenbraceNoneArrow(ctx, sx, sy, sx + objWidth, ey, objCoordset, border, dash, fw, bw, apply);
	pathStrokeAndContinue(ctx, fw, bw);
	drawLineClosebraceNoneArrow(ctx, ex - objWidth, sy, ex, ey, objCoordset, border, dash, fw, bw, apply)
}

function drawLineOpenbracketNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "0", "25", ex, ey);       //Inflection point : "F1, 0,25, 0,0, 0,50"

	ctx.moveTo(adjVal(ex, border, ex),      adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx, border, ex),      adjVal(sy + (height * f1.curY), border, ey));
	ctx.lineTo(adjVal(sx, border, ex),      adjVal(ey - (height * f1.curY), border, ey));
	ctx.lineTo(adjVal(ex, border, ex),      adjVal(ey, border, ey));
}

function drawLineClosebracketNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "100", "25", ex, ey);     //Inflection point : "F1, 100,25, 100,0, 100,50"

	ctx.moveTo(adjVal(sx, border, ex),      adjVal(sy, border, ey));
	ctx.lineTo(adjVal(ex, border, ex),      adjVal(sy + (height * f1.curY), border, ey));
	ctx.lineTo(adjVal(ex, border, ex),      adjVal(ey - (height * f1.curY), border, ey));
	ctx.lineTo(adjVal(sx, border, ex),      adjVal(ey, border, ey));
}

function drawLineDoublebracketNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var d1 = getCoordValue(aryCoordset, "d1", "25", "0", ex, ey);       //Thickness point : "D1, 25,0, 0,0, 50,0"
	var f1 = getCoordValue(aryCoordset, "f1", "0", "25", ex, ey);       //Inflection point : "F1, 0,25, 0,0, 0,50"

	var objWidth = width * d1.curX + border;

	drawLineOpenbracketNoneArrow(ctx, sx, sy, sx + objWidth, ey, aryCoordset, border, dash, fw, bw, apply);
	pathStrokeAndContinue(ctx, fw, bw);
	drawLineClosebracketNoneArrow(ctx, ex - objWidth, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply)
}

function drawLineCoordinateNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var o1 = getCoordValue(aryCoordset, "o1", "50", "50", ex, ey);      //central point : "O1, 50, 50, 0, 50, 50, 100"
	var x1 = getCoordValue(aryCoordset, "x1", "45", "0", ex, ey);       //X Graduation : "X1, 45, 0, 0, 0, 100, 0"
	var y1 = getCoordValue(aryCoordset, "y1", "0", "45", ex, ey);       //Y Graduation : "Y1, 0, 45, 0, 0, 0, 100"

	var cx = Math.round(width * o1.curX);
	var cy = Math.round(height * o1.curY);
	var ix = Math.round(width * Math.abs(o1.curX - x1.curX));
	var iy = Math.round(height * Math.abs(o1.curY - y1.curY));

	// XY axis plotting
	ctx.moveTo(adjVal(sx, border, ex),          adjVal(sy + cy, border, ey));
	ctx.lineTo(adjVal(ex, border, ex),          adjVal(sy + cy, border, ey));
	ctx.moveTo(adjVal(sx + cx, border, ex),     adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx + cx, border, ex),     adjVal(ey, border, ey));
	pathStrokeAndContinue(ctx, fw, bw);

	// Drawing XY axis scale
	ctx.strokeStyle = 'rgba(0,0,0,0.5)';
	ctx.lineWidth = 1;
	var scaleSize = border + 1;
	for (xx = cx, loop = 1; ix > 1 && (xx += ix) <= (ex + 1); loop++) {
		ctx.moveTo(adjVal(sx + xx, border, ex),             adjVal(sy + cy - scaleSize, border, ey));
		ctx.lineTo(adjVal(sx + xx, border, ex),             adjVal(sy + cy + scaleSize, border, ey));
	}
	for (xx = cx, loop = 1; ix > 1 && (xx -= ix) >= (sx - 1); loop++) {
		ctx.moveTo(adjVal(sx + xx, border, ex),             adjVal(sy + cy - scaleSize, border, ey));
		ctx.lineTo(adjVal(sx + xx, border, ex),             adjVal(sy + cy + scaleSize, border, ey));
	}
	for (yy = cy, loop = 1; iy > 1 && (yy += iy) <= (ey + 1); loop++) {
		ctx.moveTo(adjVal(sx + cx - scaleSize, border, ex), adjVal(sy + yy, border, ey));
		ctx.lineTo(adjVal(sx + cx + scaleSize, border, ex), adjVal(sy + yy, border, ey));
	}
	for (yy = cy, loop = 1; iy > 1 && (yy -= iy) >= (sy - 1); loop++) {
		ctx.moveTo(adjVal(sx + cx - scaleSize, border, ex), adjVal(sy + yy, border, ey));
		ctx.lineTo(adjVal(sx + cx + scaleSize, border, ex), adjVal(sy + yy, border, ey));
	}
	pathStrokeAndContinue(ctx, 1, 0);
}

function drawLineGridNoneArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var o1 = getCoordValue(aryCoordset, "o1", "50", "50", ex, ey);      //central point : "O1, 50, 50, 0, 50, 50, 100"
	var x1 = getCoordValue(aryCoordset, "x1", "40", "0", ex, ey);       //X Graduation : "X1, 40, 0, 0, 0, 100, 0"
	var y1 = getCoordValue(aryCoordset, "y1", "0", "40", ex, ey);       //Y Graduation : "Y1, 0, 40, 0, 0, 0, 100"

	var cx = Math.round(width * o1.curX);
	var cy = Math.round(height * o1.curY);
	var ix = Math.round(width * Math.abs(o1.curX - x1.curX));
	var iy = Math.round(height * Math.abs(o1.curY - y1.curY));

	// XY axis plotting
	ctx.moveTo(adjVal(sx, border, ex),          adjVal(sy + cy, border, ey));
	ctx.lineTo(adjVal(ex, border, ex),          adjVal(sy + cy, border, ey));
	ctx.moveTo(adjVal(sx + cx, border, ex),     adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx + cx, border, ex),     adjVal(ey, border, ey));
	pathStrokeAndContinue(ctx, fw, bw);

	// XY axis grid construction
	ctx.strokeStyle = 'rgba(0,0,0,0.5)';
	ctx.lineWidth = 1;
	for (xx = cx, loop = 1; ix > 1 && (xx += ix) <= (ex + 1); loop++) {
		ctx.moveTo(adjVal(sx + xx, border, ex), adjVal(sy, border, ey));
		ctx.lineTo(adjVal(sx + xx, border, ex), adjVal(ey, border, ey));
	}
	for (xx = cx, loop = 1; ix > 1 && (xx -= ix) >= (sx - 1); loop++) {
		ctx.moveTo(adjVal(sx + xx, border, ex), adjVal(sy, border, ey));
		ctx.lineTo(adjVal(sx + xx, border, ex), adjVal(ey, border, ey));
	}
	for (yy = cy, loop = 1; iy > 1 && (yy += iy) <= (ey + 1); loop++) {
		ctx.moveTo(adjVal(sx, border, ex),      adjVal(sy + yy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),      adjVal(sy + yy, border, ey));
	}
	for (yy = cy, loop = 1; iy > 1 && (yy -= iy) >= (sy - 1); loop++) {
		ctx.moveTo(adjVal(sx, border, ex),      adjVal(sy + yy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),      adjVal(sy + yy, border, ey));
	}
	pathStrokeAndContinue(ctx, 1, 1);
}

// If the shape functions ====================================================================================
function drawFigureRect(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	// [] construction
	ctx.moveTo(adjVal(sx + (width / 2), border, ex),    adjVal(sy, border, ey));
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(sy, border, ey),             adjVal(sx, border, ex),                 adjVal(sy + (height / 2), border, ey),  0);
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(ey, border, ey),             adjVal(sx + (width / 2), border, ex),   adjVal(ey, border, ey),                 0);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(ey, border, ey),             adjVal(ex, border, ex),                 adjVal(sy + (height / 2), border, ey),  0);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(sy, border, ey),             adjVal(sx + (width / 2), border, ex),   adjVal(sy, border, ey),                 0);

	// Drawing complement (= overlap)
	if (height < border) {
		ctx.moveTo(adjVal(sx, border, ex),              adjVal(sy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),              adjVal(sy, border, ey));
	}
}

function drawFigureRectSingleCut(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var v1 = getCoordValue(aryCoordset, "v1", "25", "0", width, height);    //vertex : "V1, 25,0, 0,0, 50@MIN(100_W:100_H),0"

	// /|_| construction
	ctx.moveTo(adjVal(width * v1.curX, border, width),      adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                    adjVal(width * v1.curX, border, height));
	ctx.lineTo(adjVal(0, border, width),                    adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
}

function drawFigureRectDoubleCut(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var v1 = getCoordValue(aryCoordset, "v1", "25", "0", width, height);    //vertex1 : "V1, 25,0, 0,0, 50@MIN(100_W:100_H),0"
	var v2 = getCoordValue(aryCoordset, "v2", "0", "100", width, height);   //vertex2 : "V2, 0,100, 0,100, 50@MIN(100_W:100_H),100"

	// [_] construction
	ctx.moveTo(adjVal(width * v1.curX, border, width),          adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(width * v1.curX, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height - (width * v2.curX), border, height));
	ctx.lineTo(adjVal(width * v2.curX, border, width),          adjVal(height, border, height));
	ctx.lineTo(adjVal(width * (1 - v2.curX), border, width),    adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(height - (width * v2.curX), border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(width * v1.curX, border, height));
	ctx.lineTo(adjVal(width * (1 - v1.curX), border, width),    adjVal(0, border, height));
}

function drawFigureRectAcrossCut(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var v1 = getCoordValue(aryCoordset, "v1", "25", "0", width, height);    //vertex1 : "V1, 25,0, 0,0, 50@MIN(100_W:100_H),0"
	var v2 = getCoordValue(aryCoordset, "v2", "0", "100", width, height);   //vertex2 : "V2, 0,100, 0,100, 50@MIN(100_W:100_H),100"

	// [_] construction
	ctx.moveTo(adjVal(width * v1.curX, border, width),          adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(width * v1.curX, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height - (width * v2.curX), border, height));
	ctx.lineTo(adjVal(width * v2.curX, border, width),          adjVal(height, border, height));
	ctx.lineTo(adjVal(width * (1 - v1.curX), border, width),    adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(height - (width * v1.curX), border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(width * v2.curX, border, height));
	ctx.lineTo(adjVal(width * (1 - v2.curX), border, width),    adjVal(0, border, height));
}

function drawFigureRectAllRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var f1 = getCoordValue(aryCoordset, "f1", "10", "0", width, height);    //Inflection point : "F1, 10,0, 0,0, 50@MIN(100_W:100_H),0"
	var radius = Math.min(Math.min(width / 2, height / 2), width * f1.curX);

	// () construction
	ctx.moveTo(adjVal(width / 2, border, width),    adjVal(0, border, height));
	ctx.arcTo(adjVal(0, border, width),             adjVal(0, border, height),          adjVal(0, border, width),               adjVal(height / 2, border, height),     radius);
	ctx.arcTo(adjVal(0, border, width),             adjVal(height, border, height),     adjVal(width / 2, border, width),       adjVal(height, border, height),         radius);
	ctx.arcTo(adjVal(width, border, width),         adjVal(height, border, height),     adjVal(width, border, width),           adjVal(height / 2, border, height),     radius);
	ctx.arcTo(adjVal(width, border, width),         adjVal(0, border, height),          adjVal(width / 2, border, width),       adjVal(0, border, height),              radius);
}

function drawFigureRectSingleRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var f1 = getCoordValue(aryCoordset, "f1", "25", "0", width, height);    //Inflection point : "F1, 25,0, 0,0, 50@MIN(100_W:100_H),0"
	var radius = Math.min(Math.min(width / 2, height / 2), width * f1.curX);

	// (|_| construction
	ctx.moveTo(adjVal(width / 2, border, width),    adjVal(0, border, height));
	ctx.arcTo(adjVal(0, border, width),             adjVal(0, border, height),          adjVal(0, border, width),               adjVal(height / 2, border, height),     radius);
	ctx.lineTo(adjVal(0, border, width),            adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),        adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),        adjVal(0, border, height));
}

function drawFigureRectDoubleRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var f1 = getCoordValue(aryCoordset, "f1", "25", "0", width, height);    //Inflection point1 : "F1, 25,0, 0,0, 50@MIN(100_W:100_H),0"
	var f2 = getCoordValue(aryCoordset, "f2", "0", "100", width, height);   //Inflection point2 : "F2, 0,100, 0,100, 50@MIN(100_W:100_H),100"
	var radius1 = Math.min(Math.min(width / 2, height / 2), width * f1.curX);
	var radius2 = Math.min(Math.min(width / 2, height / 2), width * f2.curX);

	// () construction
	ctx.moveTo(adjVal(width / 2, border, width),    adjVal(0, border, height));
	ctx.arcTo(adjVal(0, border, width),             adjVal(0, border, height),          adjVal(0, border, width),               adjVal(height / 2, border, height),     radius1);
	ctx.arcTo(adjVal(0, border, width),             adjVal(height, border, height),     adjVal(width / 2, border, width),       adjVal(height, border, height),         radius2);
	ctx.arcTo(adjVal(width, border, width),         adjVal(height, border, height),     adjVal(width, border, width),           adjVal(height / 2, border, height),     radius2);
	ctx.arcTo(adjVal(width, border, width),         adjVal(0, border, height),          adjVal(width / 2, border, width),       adjVal(0, border, height),              radius1);
}

function drawFigureRectDoubleRoundEx(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "10", "0", ex, ey);           //Inflection point : "F1, 10,0, 0,0, 50@MIN(100_W:100_H),0"
	var radius = Math.min(Math.min(width / 2, height / 2), width * f1.curX);

	// () construction
	ctx.moveTo(adjVal(sx + (width / 2), border, ex),    adjVal(sy, border, ey));
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(sy, border, ey),             adjVal(sx, border, ex),                 adjVal(sy + (height / 2), border, ey),  radius);
	ctx.lineTo(adjVal(sx, border, ex),                  adjVal(ey, border, ey));
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(ey - radius, border, ey),    adjVal(sx + (width / 2), border, ex),   adjVal(ey - radius, border, ey),        radius);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(ey - radius, border, ey),    adjVal(ex, border, ex),                 adjVal(ey, border, ey),                 radius);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(sy, border, ey),             adjVal(sx + (width / 2), border, ex),   adjVal(sy, border, ey),                 radius);
}

function drawFigureRectAcrossRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var f1 = getCoordValue(aryCoordset, "f1", "25", "0", width, height);    //Inflection point1 : "F1, 25,0, 0,0, 50@MIN(100_W:100_H),0"
	var f2 = getCoordValue(aryCoordset, "f2", "0", "100", width, height);   //Inflection point2 : "F2, 0,100, 0,100, 50@MIN(100_W:100_H),100"
	var radius1 = Math.min(Math.min(width / 2, height / 2), width * f1.curX);
	var radius2 = Math.min(Math.min(width / 2, height / 2), width * f2.curX);

	// () construction
	ctx.moveTo(adjVal(width / 2, border, width),    adjVal(0, border, height));
	ctx.arcTo(adjVal(0, border, width),             adjVal(0, border, height),          adjVal(0, border, width),               adjVal(height / 2, border, height),     radius1);
	ctx.arcTo(adjVal(0, border, width),             adjVal(height, border, height),     adjVal(width / 2, border, width),       adjVal(height, border, height),         radius2);
	ctx.arcTo(adjVal(width, border, width),         adjVal(height, border, height),     adjVal(width, border, width),           adjVal(height / 2, border, height),     radius1);
	ctx.arcTo(adjVal(width, border, width),         adjVal(0, border, height),          adjVal(width / 2, border, width),       adjVal(0, border, height),              radius2);
}

function drawFigureCircle(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var xCenter = sx + (width / 2);
	var yCenter = sy + (height / 2);
	var xRadius = width / 2;
	var yRadius = height / 2;

	var circular = 0.225;
	var xGap = width * circular;
	var yGap = height * circular;

	// () construction
	ctx.moveTo(adjVal(xCenter, border, ex),                          adjVal(yCenter - yRadius, border, ey));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius + xGap, border, ex),  adjVal(yCenter - yRadius, border, ey),          adjVal(xCenter - xRadius, border, ex),           adjVal(yCenter - yRadius + yGap, border, ey),   adjVal(xCenter - xRadius, border, ex),   adjVal(yCenter, border, ey));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius, border, ex),         adjVal(yCenter + yRadius - yGap, border, ey),   adjVal(xCenter - xRadius + xGap, border, ex),    adjVal(yCenter + yRadius, border, ey),          adjVal(xCenter, border, ex),             adjVal(yCenter + yRadius, border, ey));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius - xGap, border, ex),  adjVal(yCenter + yRadius, border, ey),          adjVal(xCenter + xRadius, border, ex),           adjVal(yCenter + yRadius - yGap, border, ey),   adjVal(xCenter + xRadius, border, ex),   adjVal(yCenter, border, ey));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius, border, ex),         adjVal(yCenter - yRadius + yGap, border, ey),   adjVal(xCenter + xRadius - xGap, border, ex),    adjVal(yCenter - yRadius, border, ey),          adjVal(xCenter, border, ex),             adjVal(yCenter - yRadius, border, ey));
}

function drawFigureTrapezoidal(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {   //Trapezoid
	var v1 = getCoordValue(aryCoordset, "v1", "25", "0", width, height);    //vertex : "V1, 25,0, 0,0, 50,0"

	// /_| construction
	ctx.moveTo(adjVal(width * v1.curX, border, width),          adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(height, border, height));
	ctx.lineTo(adjVal(width * (1 - v1.curX), border, width),    adjVal(0, border, height));
}

function drawFigureParallelogram(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) { //Parallelogram
	var v1 = getCoordValue(aryCoordset, "v1", "25", "0", width, height);    //vertex : "V1, 25,0, 0,0, 100,0"

	// /_/ construction
	ctx.moveTo(adjVal(width * v1.curX, border, width),          adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height, border, height));
	ctx.lineTo(adjVal(width * (1 - v1.curX), border, width),    adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(0, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing supplement (// nested)
	if (same_x(0, 1 - v1.curX, border, width)) {
		ctx.moveTo(adjVal(0, border, width),                    adjVal(height, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
	}
	ctx.moveTo(adjVal(0, border, width),                        adjVal(0, border, height)); // Path End.
}

function drawFigureTriangle(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {      //triangle
	var v1 = getCoordValue(aryCoordset, "v1", "50", "0", width, height);    //vertex : "V1, 50,0, 0,0, 100,0"

	// /_ construction
	ctx.moveTo(adjVal(width * v1.curX, border, width),  adjVal(height * v1.curY, border, height));
	ctx.lineTo(adjVal(0, border, width),                adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),            adjVal(height, border, height));
}

function drawFigureTetragon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {          //Tetragon
	// <> construction
	ctx.moveTo(adjVal(width / 2, border, width),    adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),            adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width / 2, border, width),    adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),        adjVal(height / 2, border, height));
}

function drawFigurePentagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {          //pentagon
	var c1 = getCoordValue(aryCoordset, "c1", "50", "75.75", width, height);    //Crack point : "C1, 50,75.75, 50,55, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.55;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var VP = [];
	VP[0] = {}; VP[0].px = CX - (maxDY * Math.tan(36*Math.PI/180));     VP[0].py = 1;   //CY + maxDY;
	VP[1] = {}; VP[1].px = 0;                                           VP[1].py = CY - (CX * Math.tan(18*Math.PI/180));
	VP[2] = {}; VP[2].px = CX;                                          VP[2].py = 0;   //CY - CY;
	VP[3] = {}; VP[3].px = 1;                                           VP[3].py = CY - (CX * Math.tan(18*Math.PI/180));
	VP[4] = {}; VP[4].px = CX + (maxDY * Math.tan(36*Math.PI/180));     VP[4].py = 1;   //CY + maxDY;

	ctx.moveTo(adjVal(width * VP[0].px, border, width),     adjVal(height * VP[0].py, border, height));
	ctx.lineTo(adjVal(width * VP[1].px, border, width),     adjVal(height * VP[1].py, border, height));
	ctx.lineTo(adjVal(width * VP[2].px, border, width),     adjVal(height * VP[2].py, border, height));
	ctx.lineTo(adjVal(width * VP[3].px, border, width),     adjVal(height * VP[3].py, border, height));
	ctx.lineTo(adjVal(width * VP[4].px, border, width),     adjVal(height * VP[4].py, border, height));
}

function drawFigureHexagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {       //hexagon
	var VP = [];
	VP[0] = {};     VP[0].px = 0.50;    VP[0].py = 0.00;
	VP[1] = {};     VP[1].px = 0.00;    VP[1].py = 0.25;
	VP[2] = {};     VP[2].px = 0.00;    VP[2].py = 0.75;
	VP[3] = {};     VP[3].px = 0.50;    VP[3].py = 1.00;
	VP[4] = {};     VP[4].px = 1.00;    VP[4].py = 0.75;
	VP[5] = {};     VP[5].px = 1.00;    VP[5].py = 0.25;

	ctx.moveTo(adjVal(width * VP[0].px, border, width),         adjVal(height * VP[0].py, border, height));
	for (loop = 1; loop < 6; loop++) {
		ctx.lineTo(adjVal(width * VP[loop].px, border, width),  adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureHeptagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {      //heptagon
	var VP = [];
	VP[0] = {};     VP[0].px = 0.50;    VP[0].py = 0.00;
	VP[1] = {};     VP[1].px = 0.10;    VP[1].py = 0.20;
	VP[2] = {};     VP[2].px = 0.00;    VP[2].py = 0.65;
	VP[3] = {};     VP[3].px = 0.28;    VP[3].py = 1.00;
	VP[4] = {};     VP[4].px = 0.72;    VP[4].py = 1.00;
	VP[5] = {};     VP[5].px = 1.00;    VP[5].py = 0.65;
	VP[6] = {};     VP[6].px = 0.90;    VP[6].py = 0.20;

	ctx.moveTo(adjVal(width * VP[0].px, border, width),         adjVal(height * VP[0].py, border, height));
	for (loop = 1; loop < 7; loop++) {
		ctx.lineTo(adjVal(width * VP[loop].px, border, width),  adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureOctagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {       //octagon
	var VP = [];
	VP[0] = {};     VP[0].px = 0.50;    VP[0].py = 0.00;
	VP[1] = {};     VP[1].px = 0.15;    VP[1].py = 0.15;
	VP[2] = {};     VP[2].px = 0.00;    VP[2].py = 0.50;
	VP[3] = {};     VP[3].px = 0.15;    VP[3].py = 0.85;
	VP[4] = {};     VP[4].px = 0.50;    VP[4].py = 1.00;
	VP[5] = {};     VP[5].px = 0.85;    VP[5].py = 0.85;
	VP[6] = {};     VP[6].px = 1.00;    VP[6].py = 0.50;
	VP[7] = {};     VP[7].px = 0.85;    VP[7].py = 0.15;

	ctx.moveTo(adjVal(width * VP[0].px, border, width),         adjVal(height * VP[0].py, border, height));
	for (loop = 1; loop < 8; loop++) {
		ctx.lineTo(adjVal(width * VP[loop].px, border, width),  adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureNonagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {       //Nonagon
	var VP = [];
	VP[0] = {};     VP[0].px = 0.50;    VP[0].py = 0.00;
	VP[1] = {};     VP[1].px = 0.18;    VP[1].py = 0.12;
	VP[2] = {};     VP[2].px = 0.00;    VP[2].py = 0.42;
	VP[3] = {};     VP[3].px = 0.07;    VP[3].py = 0.76;
	VP[4] = {};     VP[4].px = 0.33;    VP[4].py = 1.00;
	VP[5] = {};     VP[5].px = 0.67;    VP[5].py = 1.00;
	VP[6] = {};     VP[6].px = 0.93;    VP[6].py = 0.76;
	VP[7] = {};     VP[7].px = 1.00;    VP[7].py = 0.42;
	VP[8] = {};     VP[8].px = 0.82;    VP[8].py = 0.12;

	ctx.moveTo(adjVal(width * VP[0].px, border, width),         adjVal(height * VP[0].py, border, height));
	for (loop = 1; loop < 9; loop++) {
		ctx.lineTo(adjVal(width * VP[loop].px, border, width),  adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureDecagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {       //Decagon
	var VP = [];
	VP[0] = {};     VP[0].px = 0.50;    VP[0].py = 0.00;
	VP[1] = {};     VP[1].px = 0.19;    VP[1].py = 0.10;
	VP[2] = {};     VP[2].px = 0.00;    VP[2].py = 0.35;
	VP[3] = {};     VP[3].px = 0.00;    VP[3].py = 0.65;
	VP[4] = {};     VP[4].px = 0.19;    VP[4].py = 0.90;
	VP[5] = {};     VP[5].px = 0.50;    VP[5].py = 1.00;
	VP[6] = {};     VP[6].px = 0.81;    VP[6].py = 0.90;
	VP[7] = {};     VP[7].px = 1.00;    VP[7].py = 0.65;
	VP[8] = {};     VP[8].px = 1.00;    VP[8].py = 0.35;
	VP[9] = {};     VP[9].px = 0.81;    VP[9].py = 0.10;

	ctx.moveTo(adjVal(width * VP[0].px, border, width), adjVal(height * VP[0].py, border, height));
	for (loop = 1; loop < 10; loop++) {
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureDodecagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {     //Dodecagon
	var VP = [];
	VP[0] = {};     VP[0].px = 0.50;    VP[0].py = 0.00;
	VP[1] = {};     VP[1].px = 0.25;    VP[1].py = 0.07;
	VP[2] = {};     VP[2].px = 0.07;    VP[2].py = 0.25;
	VP[3] = {};     VP[3].px = 0.00;    VP[3].py = 0.50;
	VP[4] = {};     VP[4].px = 0.07;    VP[4].py = 0.75;
	VP[5] = {};     VP[5].px = 0.25;    VP[5].py = 0.93;
	VP[6] = {};     VP[6].px = 0.50;    VP[6].py = 1.00;
	VP[7] = {};     VP[7].px = 0.75;    VP[7].py = 0.93;
	VP[8] = {};     VP[8].px = 0.93;    VP[8].py = 0.75;
	VP[9] = {};     VP[9].px = 1.00;    VP[9].py = 0.50;
	VP[10] = {};    VP[10].px = 0.93;   VP[10].py = 0.25;
	VP[11] = {};    VP[11].px = 0.75;   VP[11].py = 0.07;

	ctx.moveTo(adjVal(width * VP[0].px, border, width), adjVal(height * VP[0].py, border, height));
	for (loop = 1; loop < 12; loop++) {
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureTristar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {           //Triangular stars
	var c1 = getCoordValue(aryCoordset, "c1", "50", "75.75", width, height);    // Crack point : "C1, 50,75.75, 50,62.5, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.625;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust= 0.725;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX;                                                      CP[0].py = CY + curDY;
	CP[1] = {};     CP[1].px = CX - (curDY * Math.sin(60 * Math.PI / 180) * adjCP);     CP[1].py = CY - (curDY * Math.cos(60 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX + (curDY * Math.sin(60 * Math.PI / 180) * adjCP);     CP[2].py = CY - (curDY * Math.cos(60 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0;                                                       VP[0].py = 1;
	VP[1] = {};     VP[1].px = CX;                                                      VP[1].py = 0;
	VP[2] = {};     VP[2].px = 1;                                                       VP[2].py = 1;

	for (loop = 0; loop < 3; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop-1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width),                      adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width),                      adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width),                          adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureTetragonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {    //Stars Square
	var c1 = getCoordValue(aryCoordset, "c1", "50", "65", width, height);       // Crack point : "C1, 50,65, 50,50, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.5;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.7;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX - (curDY * Math.sin(45 * Math.PI / 180) * adjCP);     CP[0].py = CY + (curDY * Math.cos(45 * Math.PI / 180) * adjCP);
	CP[1] = {};     CP[1].px = CX - (curDY * Math.sin(45 * Math.PI / 180) * adjCP);     CP[1].py = CY - (curDY * Math.cos(45 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX + (curDY * Math.sin(45 * Math.PI / 180) * adjCP);     CP[2].py = CY - (curDY * Math.cos(45 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX + (curDY * Math.sin(45 * Math.PI / 180) * adjCP);     CP[3].py = CY + (curDY * Math.cos(45 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0;                                                       VP[0].py = 0.5;
	VP[1] = {};     VP[1].px = 0.5;                                                     VP[1].py = 0;
	VP[2] = {};     VP[2].px = 1;                                                       VP[2].py = 0.5;
	VP[3] = {};     VP[3].px = 0.5;                                                     VP[3].py = 1;

	for (loop = 0; loop < 4; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigurePentagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {    //Pentagonal stars
	var c1 = getCoordValue(aryCoordset, "c1", "50", "75.75", width, height);    // Crack point : "C1, 50,75.75, 50,55, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.55;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjCP = 0.965;
	CP[0] = {};     CP[0].px = CX;                                                      CP[0].py = CY + curDY;
	CP[1] = {};     CP[1].px = CX - (curDY * Math.cos(18 * Math.PI / 180) * adjCP);     CP[1].py = CY + (curDY * Math.sin(18 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX - (curDY * Math.sin(36 * Math.PI / 180) * adjCP);     CP[2].py = CY - (curDY * Math.cos(36 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX + (curDY * Math.cos(54 * Math.PI / 180) * adjCP);     CP[3].py = CY - (curDY * Math.sin(54 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX + (curDY * Math.cos(18 * Math.PI / 180) * adjCP);     CP[4].py = CY + (curDY * Math.sin(18 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = CX - (maxDY * Math.tan(36 * Math.PI / 180));             VP[0].py = 1;   //CY + maxDY;
	VP[1] = {};     VP[1].px = 0;                                                       VP[1].py = CY - (CX * Math.tan(18 * Math.PI / 180));
	VP[2] = {};     VP[2].px = CX;                                                      VP[2].py = 0;   //CY - CY;
	VP[3] = {};     VP[3].px = 1;                                                       VP[3].py = CY - (CX * Math.tan(18 * Math.PI / 180));
	VP[4] = {};     VP[4].px = CX + (maxDY * Math.tan(36 * Math.PI / 180));             VP[4].py = 1;   //CY + maxDY;

	for (loop = 0; loop < 5; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop-1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width),                      adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width),                      adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width),                          adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureHexagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {     //Allen stars
	var c1 = getCoordValue(aryCoordset, "c1", "50", "80.50", width, height);    // Crack point : "C1, 50,80.50, 50,50, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.5;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.9;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX - (curDY * Math.sin(30 * Math.PI / 180) * adjCP);     CP[0].py = CY + (curDY * Math.cos(30 * Math.PI / 180) * adjCP);
	CP[1] = {};     CP[1].px = CX - curDY;                                              CP[1].py = 0.5;
	CP[2] = {};     CP[2].px = CX - (curDY * Math.sin(30 * Math.PI / 180) * adjCP);     CP[2].py = CY - (curDY * Math.cos(30 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX + (curDY * Math.sin(30 * Math.PI / 180) * adjCP);     CP[3].py = CY - (curDY * Math.cos(30 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX + curDY;                                              CP[4].py = 0.5;
	CP[5] = {};     CP[5].px = CX + (curDY * Math.sin(30 * Math.PI / 180) * adjCP);     CP[5].py = CY + (curDY * Math.cos(30 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0;            VP[0].py = 0.75;
	VP[1] = {};     VP[1].px = 0;            VP[1].py = 0.25;
	VP[2] = {};     VP[2].px = 0.5;          VP[2].py = 0;
	VP[3] = {};     VP[3].px = 1;            VP[3].py = 0.25;
	VP[4] = {};     VP[4].px = 1;            VP[4].py = 0.75;
	VP[5] = {};     VP[5].px = 0.5;          VP[5].py = 1;

	for (loop = 0; loop < 6; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureHeptagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {    //Heptagonal star
	var c1 = getCoordValue(aryCoordset, "c1", "50", "89.25", width, height);    // Crack point : "C1, 50,89.25, 50,52.50, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.525;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.975;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX;                                                          CP[0].py = CY + curDY;
	CP[1] = {};     CP[1].px = CX - (curDY * Math.sin(51.5 * Math.PI / 180) * adjCP);       CP[1].py = CY + (curDY * Math.cos(51.5 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX - (curDY * Math.cos(12.75 * Math.PI / 180) * adjCP);      CP[2].py = CY - (curDY * Math.sin(12.75 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX - (curDY * Math.sin(25.75 * Math.PI / 180) * adjCP);      CP[3].py = CY - (curDY * Math.cos(25.75 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX + (curDY * Math.sin(25.75 * Math.PI / 180) * adjCP);      CP[4].py = CY - (curDY * Math.cos(25.75 * Math.PI / 180) * adjCP);
	CP[5] = {};     CP[5].px = CX + (curDY * Math.cos(12.75 * Math.PI / 180) * adjCP);      CP[5].py = CY - (curDY * Math.sin(12.75 * Math.PI / 180) * adjCP);
	CP[6] = {};     CP[6].px = CX + (curDY * Math.sin(51.5 * Math.PI / 180) * adjCP);       CP[6].py = CY + (curDY * Math.cos(51.5 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0.28;         VP[0].py = 1.00;
	VP[1] = {};     VP[1].px = 0.00;         VP[1].py = 0.65;
	VP[2] = {};     VP[2].px = 0.10;         VP[2].py = 0.20;
	VP[3] = {};     VP[3].px = 0.50;         VP[3].py = 0.00;
	VP[4] = {};     VP[4].px = 0.90;         VP[4].py = 0.20;
	VP[5] = {};     VP[5].px = 1.00;         VP[5].py = 0.65;
	VP[6] = {};     VP[6].px = 0.72;         VP[6].py = 1.00;

	for (loop = 0; loop < 7; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureOctagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {     //Octagonal stars
	var c1 = getCoordValue(aryCoordset, "c1", "50", "90.25", width, height);    // Crack point : "C1, 50,90.25, 50,50, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.5;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.925;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX - (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);       CP[0].py = CY + (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);
	CP[1] = {};     CP[1].px = CX - (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);       CP[1].py = CY + (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX - (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);       CP[2].py = CY - (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX - (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);       CP[3].py = CY - (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX + (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);       CP[4].py = CY - (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);
	CP[5] = {};     CP[5].px = CX + (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);       CP[5].py = CY - (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);
	CP[6] = {};     CP[6].px = CX + (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);       CP[6].py = CY + (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);
	CP[7] = {};     CP[7].px = CX + (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);       CP[7].py = CY + (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0.15;         VP[0].py = 0.85;
	VP[1] = {};     VP[1].px = 0.00;         VP[1].py = 0.50;
	VP[2] = {};     VP[2].px = 0.15;         VP[2].py = 0.15;
	VP[3] = {};     VP[3].px = 0.50;         VP[3].py = 0.00;
	VP[4] = {};     VP[4].px = 0.85;         VP[4].py = 0.15;
	VP[5] = {};     VP[5].px = 1.00;         VP[5].py = 0.50;
	VP[6] = {};     VP[6].px = 0.85;         VP[6].py = 0.85;
	VP[7] = {};     VP[7].px = 0.50;         VP[7].py = 1.00;

	for (loop = 0; loop < 8; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureNonagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {     //Nonagonal star
	var c1 = getCoordValue(aryCoordset, "c1", "50", "93.25", width, height);    // Crack point : "C1, 50,93.25, 50,50.50, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.505;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.965;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX;                                                          CP[0].py = CY + curDY;
	CP[1] = {};     CP[1].px = CX - (curDY * Math.sin(40 * Math.PI / 180) * adjCP);         CP[1].py = CY + (curDY * Math.cos(40 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX - (curDY * Math.cos(10 * Math.PI / 180) * adjCP);         CP[2].py = CY + (curDY * Math.sin(10 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX - (curDY * Math.cos(30 * Math.PI / 180) * adjCP);         CP[3].py = CY - (curDY * Math.sin(30 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX - (curDY * Math.sin(20 * Math.PI / 180) * adjCP);         CP[4].py = CY - (curDY * Math.cos(20 * Math.PI / 180) * adjCP);
	CP[5] = {};     CP[5].px = CX + (curDY * Math.sin(20 * Math.PI / 180) * adjCP);         CP[5].py = CY - (curDY * Math.cos(20 * Math.PI / 180) * adjCP);
	CP[6] = {};     CP[6].px = CX + (curDY * Math.cos(30 * Math.PI / 180) * adjCP);         CP[6].py = CY - (curDY * Math.sin(30 * Math.PI / 180) * adjCP);
	CP[7] = {};     CP[7].px = CX + (curDY * Math.cos(10 * Math.PI / 180) * adjCP);         CP[7].py = CY + (curDY * Math.sin(10 * Math.PI / 180) * adjCP);
	CP[8] = {};     CP[8].px = CX + (curDY * Math.sin(40 * Math.PI / 180) * adjCP);         CP[8].py = CY + (curDY * Math.cos(40 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0.33;         VP[0].py = 1.00;
	VP[1] = {};     VP[1].px = 0.07;         VP[1].py = 0.76;
	VP[2] = {};     VP[2].px = 0.00;         VP[2].py = 0.42;
	VP[3] = {};     VP[3].px = 0.18;         VP[3].py = 0.12;
	VP[4] = {};     VP[4].px = 0.50;         VP[4].py = 0.00;
	VP[5] = {};     VP[5].px = 0.82;         VP[5].py = 0.12;
	VP[6] = {};     VP[6].px = 1.00;         VP[6].py = 0.42;
	VP[7] = {};     VP[7].px = 0.93;         VP[7].py = 0.76;
	VP[8] = {};     VP[8].px = 0.67;         VP[8].py = 1.00;

	for (loop = 0; loop < 9; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureDecagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {     // Decagonal star
	var c1 = getCoordValue(aryCoordset, "c1", "50", "93", width, height);       // Crack point : "C1, 50,93.50, 50,50, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.5;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.965;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX - (curDY * Math.sin(18 * Math.PI / 180) * adjCP);         CP[0].py = CY + (curDY * Math.cos(18 * Math.PI / 180) * adjCP);
	CP[1] = {};     CP[1].px = CX - (curDY * Math.cos(36 * Math.PI / 180) * adjCP);         CP[1].py = CY + (curDY * Math.sin(36 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX - curDY;                                                  CP[2].py = 0.5;
	CP[3] = {};     CP[3].px = CX - (curDY * Math.cos(36 * Math.PI / 180) * adjCP);         CP[3].py = CY - (curDY * Math.sin(36 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX - (curDY * Math.sin(18 * Math.PI / 180) * adjCP);         CP[4].py = CY - (curDY * Math.cos(18 * Math.PI / 180) * adjCP);
	CP[5] = {};     CP[5].px = CX + (curDY * Math.sin(18 * Math.PI / 180) * adjCP);         CP[5].py = CY - (curDY * Math.cos(18 * Math.PI / 180) * adjCP);
	CP[6] = {};     CP[6].px = CX + (curDY * Math.cos(36 * Math.PI / 180) * adjCP);         CP[6].py = CY - (curDY * Math.sin(36 * Math.PI / 180) * adjCP);
	CP[7] = {};     CP[7].px = CX + curDY;                                                  CP[7].py = 0.5;
	CP[8] = {};     CP[8].px = CX + (curDY * Math.cos(36 * Math.PI / 180) * adjCP);         CP[8].py = CY + (curDY * Math.sin(36 * Math.PI / 180) * adjCP);
	CP[9] = {};     CP[9].px = CX + (curDY * Math.sin(18 * Math.PI / 180) * adjCP);         CP[9].py = CY + (curDY * Math.cos(18 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0.19;         VP[0].py = 0.90;
	VP[1] = {};     VP[1].px = 0.00;         VP[1].py = 0.65;
	VP[2] = {};     VP[2].px = 0.00;         VP[2].py = 0.35;
	VP[3] = {};     VP[3].px = 0.19;         VP[3].py = 0.10;
	VP[4] = {};     VP[4].px = 0.50;         VP[4].py = 0.00;
	VP[5] = {};     VP[5].px = 0.81;         VP[5].py = 0.10;
	VP[6] = {};     VP[6].px = 1.00;         VP[6].py = 0.35;
	VP[7] = {};     VP[7].px = 1.00;         VP[7].py = 0.65;
	VP[8] = {};     VP[8].px = 0.81;         VP[8].py = 0.90;
	VP[9] = {};     VP[9].px = 0.50;         VP[9].py = 1.00;

	for (loop = 0; loop < 10; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureDodecagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {   // Dodecagonal star
	var c1 = getCoordValue(aryCoordset, "c1", "50", "87.50", width, height);    // Crack point : "C1, 50,87.50, 50,50, 50,100"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.5;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.965;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX - (curDY * Math.sin(15 * Math.PI / 180) * adjCP);         CP[0].py = CY + (curDY * Math.cos(15 * Math.PI / 180) * adjCP);
	CP[1] = {};     CP[1].px = CX - (curDY * Math.sin(45 * Math.PI / 180) * adjCP);         CP[1].py = CY + (curDY * Math.cos(45 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX - (curDY * Math.cos(15 * Math.PI / 180) * adjCP);         CP[2].py = CY + (curDY * Math.sin(15 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX - (curDY * Math.cos(15 * Math.PI / 180) * adjCP);         CP[3].py = CY - (curDY * Math.sin(15 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX - (curDY * Math.sin(45 * Math.PI / 180) * adjCP);         CP[4].py = CY - (curDY * Math.cos(45 * Math.PI / 180) * adjCP);
	CP[5] = {};     CP[5].px = CX - (curDY * Math.sin(15 * Math.PI / 180) * adjCP);         CP[5].py = CY - (curDY * Math.cos(15 * Math.PI / 180) * adjCP);
	CP[6] = {};     CP[6].px = CX + (curDY * Math.sin(15 * Math.PI / 180) * adjCP);         CP[6].py = CY - (curDY * Math.cos(15 * Math.PI / 180) * adjCP);
	CP[7] = {};     CP[7].px = CX + (curDY * Math.sin(45 * Math.PI / 180) * adjCP);         CP[7].py = CY - (curDY * Math.cos(45 * Math.PI / 180) * adjCP);
	CP[8] = {};     CP[8].px = CX + (curDY * Math.cos(15 * Math.PI / 180) * adjCP);         CP[8].py = CY - (curDY * Math.sin(15 * Math.PI / 180) * adjCP);
	CP[9] = {};     CP[9].px = CX + (curDY * Math.cos(15 * Math.PI / 180) * adjCP);         CP[9].py = CY + (curDY * Math.sin(15 * Math.PI / 180) * adjCP);
	CP[10] = {};    CP[10].px = CX + (curDY * Math.sin(45 * Math.PI / 180) * adjCP);        CP[10].py = CY + (curDY * Math.cos(45 * Math.PI / 180) * adjCP);
	CP[11] = {};    CP[11].px = CX + (curDY * Math.sin(15 * Math.PI / 180) * adjCP);        CP[11].py = CY + (curDY * Math.cos(15 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0.25;         VP[0].py = 0.93;
	VP[1] = {};     VP[1].px = 0.07;         VP[1].py = 0.75;
	VP[2] = {};     VP[2].px = 0.00;         VP[2].py = 0.50;
	VP[3] = {};     VP[3].px = 0.07;         VP[3].py = 0.25;
	VP[4] = {};     VP[4].px = 0.25;         VP[4].py = 0.07;
	VP[5] = {};     VP[5].px = 0.50;         VP[5].py = 0.00;
	VP[6] = {};     VP[6].px = 0.75;         VP[6].py = 0.07;
	VP[7] = {};     VP[7].px = 0.93;         VP[7].py = 0.25;
	VP[8] = {};     VP[8].px = 1.00;         VP[8].py = 0.50;
	VP[9] = {};     VP[9].px = 0.93;         VP[9].py = 0.75;
	VP[10] = {};    VP[10].px = 0.75;        VP[10].py = 0.93;
	VP[11] = {};    VP[11].px = 0.50;        VP[11].py = 1.00;

	for (loop = 0; loop < 12; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureSixteenstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {       // Sixteen star
	var c1 = getCoordValue(aryCoordset, "c1", "50", "87.50", width, height);    // Crack point : "C1, 50,87.50, 50,50, 50,97"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.5;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.985;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX - (curDY * Math.sin(11.25 * Math.PI / 180) * adjCP);      CP[0].py = CY + (curDY * Math.cos(11.25 * Math.PI / 180) * adjCP);
	CP[1] = {};     CP[1].px = CX - (curDY * Math.sin(33.75 * Math.PI / 180) * adjCP);      CP[1].py = CY + (curDY * Math.cos(33.75 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX - (curDY * Math.cos(33.75 * Math.PI / 180) * adjCP);      CP[2].py = CY + (curDY * Math.sin(33.75 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX - (curDY * Math.cos(11.25 * Math.PI / 180) * adjCP);      CP[3].py = CY + (curDY * Math.sin(11.25 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX - (curDY * Math.cos(11.25 * Math.PI / 180) * adjCP);      CP[4].py = CY - (curDY * Math.sin(11.25 * Math.PI / 180) * adjCP);
	CP[5] = {};     CP[5].px = CX - (curDY * Math.cos(33.75 * Math.PI / 180) * adjCP);      CP[5].py = CY - (curDY * Math.sin(33.75 * Math.PI / 180) * adjCP);
	CP[6] = {};     CP[6].px = CX - (curDY * Math.sin(33.75 * Math.PI / 180) * adjCP);      CP[6].py = CY - (curDY * Math.cos(33.75 * Math.PI / 180) * adjCP);
	CP[7] = {};     CP[7].px = CX - (curDY * Math.sin(11.25 * Math.PI / 180) * adjCP);      CP[7].py = CY - (curDY * Math.cos(11.25 * Math.PI / 180) * adjCP);
	CP[8] = {};     CP[8].px = CX + (curDY * Math.sin(11.25 * Math.PI / 180) * adjCP);      CP[8].py = CY - (curDY * Math.cos(11.25 * Math.PI / 180) * adjCP);
	CP[9] = {};     CP[9].px = CX + (curDY * Math.sin(33.75 * Math.PI / 180) * adjCP);      CP[9].py = CY - (curDY * Math.cos(33.75 * Math.PI / 180) * adjCP);
	CP[10] = {};    CP[10].px = CX + (curDY * Math.cos(33.75 * Math.PI / 180) * adjCP);     CP[10].py = CY - (curDY * Math.sin(33.75 * Math.PI / 180) * adjCP);
	CP[11] = {};    CP[11].px = CX + (curDY * Math.cos(11.25 * Math.PI / 180) * adjCP);     CP[11].py = CY - (curDY * Math.sin(11.25 * Math.PI / 180) * adjCP);
	CP[12] = {};    CP[12].px = CX + (curDY * Math.cos(11.25 * Math.PI / 180) * adjCP);     CP[12].py = CY + (curDY * Math.sin(11.25 * Math.PI / 180) * adjCP);
	CP[13] = {};    CP[13].px = CX + (curDY * Math.cos(33.75 * Math.PI / 180) * adjCP);     CP[13].py = CY + (curDY * Math.sin(33.75 * Math.PI / 180) * adjCP);
	CP[14] = {};    CP[14].px = CX + (curDY * Math.sin(33.75 * Math.PI / 180) * adjCP);     CP[14].py = CY + (curDY * Math.cos(33.75 * Math.PI / 180) * adjCP);
	CP[15] = {};    CP[15].px = CX + (curDY * Math.sin(11.25 * Math.PI / 180) * adjCP);     CP[15].py = CY + (curDY * Math.cos(11.25 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0.30;         VP[0].py = 0.96;
	VP[1] = {};     VP[1].px = 0.14;         VP[1].py = 0.86;
	VP[2] = {};     VP[2].px = 0.04;         VP[2].py = 0.69;
	VP[3] = {};     VP[3].px = 0.00;         VP[3].py = 0.50;
	VP[4] = {};     VP[4].px = 0.04;         VP[4].py = 0.31;
	VP[5] = {};     VP[5].px = 0.14;         VP[5].py = 0.14;
	VP[6] = {};     VP[6].px = 0.30;         VP[6].py = 0.04;
	VP[7] = {};     VP[7].px = 0.50;         VP[7].py = 0.00;
	VP[8] = {};     VP[8].px = 0.70;         VP[8].py = 0.04;
	VP[9] = {};     VP[9].px = 0.86;         VP[9].py = 0.14;
	VP[10] = {};    VP[10].px = 0.96;        VP[10].py = 0.31;
	VP[11] = {};    VP[11].px = 1.00;        VP[11].py = 0.50;
	VP[12] = {};    VP[12].px = 0.96;        VP[12].py = 0.69;
	VP[13] = {};    VP[13].px = 0.86;        VP[13].py = 0.86;
	VP[14] = {};    VP[14].px = 0.70;        VP[14].py = 0.96;
	VP[15] = {};    VP[15].px = 0.50;        VP[15].py = 1.00;

	for (loop = 0; loop < 16; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width), adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width), adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureTwentyfourstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {    // Twentyfour star
	var c1 = getCoordValue(aryCoordset, "c1", "50", "87.50", width, height);    // Crack point : "C1, 50,87.50, 50,50, 50,98"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.5;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.990;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX - (curDY * Math.sin(7.5 * Math.PI / 180) * adjCP);        CP[0].py = CY + (curDY * Math.cos(7.5 * Math.PI / 180) * adjCP);
	CP[1] = {};     CP[1].px = CX - (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);       CP[1].py = CY + (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX - (curDY * Math.sin(37.5 * Math.PI / 180) * adjCP);       CP[2].py = CY + (curDY * Math.cos(37.5 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX - (curDY * Math.cos(37.5 * Math.PI / 180) * adjCP);       CP[3].py = CY + (curDY * Math.sin(37.5 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX - (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);       CP[4].py = CY + (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);
	CP[5] = {};     CP[5].px = CX - (curDY * Math.cos(7.5 * Math.PI / 180) * adjCP);        CP[5].py = CY + (curDY * Math.sin(7.5 * Math.PI / 180) * adjCP);
	CP[6] = {};     CP[6].px = CX - (curDY * Math.cos(7.5 * Math.PI / 180) * adjCP);        CP[6].py = CY - (curDY * Math.sin(7.5 * Math.PI / 180) * adjCP);
	CP[7] = {};     CP[7].px = CX - (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);       CP[7].py = CY - (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);
	CP[8] = {};     CP[8].px = CX - (curDY * Math.cos(37.5 * Math.PI / 180) * adjCP);       CP[8].py = CY - (curDY * Math.sin(37.5 * Math.PI / 180) * adjCP);
	CP[9] = {};     CP[9].px = CX - (curDY * Math.sin(37.5 * Math.PI / 180) * adjCP);       CP[9].py = CY - (curDY * Math.cos(37.5 * Math.PI / 180) * adjCP);
	CP[10] = {};    CP[10].px = CX - (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);      CP[10].py = CY - (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);
	CP[11] = {};    CP[11].px = CX - (curDY * Math.sin(7.5 * Math.PI / 180) * adjCP);       CP[11].py = CY - (curDY * Math.cos(7.5 * Math.PI / 180) * adjCP);
	CP[12] = {};    CP[12].px = CX + (curDY * Math.sin(7.5 * Math.PI / 180) * adjCP);       CP[12].py = CY - (curDY * Math.cos(7.5 * Math.PI / 180) * adjCP);
	CP[13] = {};    CP[13].px = CX + (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);      CP[13].py = CY - (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);
	CP[14] = {};    CP[14].px = CX + (curDY * Math.sin(37.5 * Math.PI / 180) * adjCP);      CP[14].py = CY - (curDY * Math.cos(37.5 * Math.PI / 180) * adjCP);
	CP[15] = {};    CP[15].px = CX + (curDY * Math.cos(37.5 * Math.PI / 180) * adjCP);      CP[15].py = CY - (curDY * Math.sin(37.5 * Math.PI / 180) * adjCP);
	CP[16] = {};    CP[16].px = CX + (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);      CP[16].py = CY - (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);
	CP[17] = {};    CP[17].px = CX + (curDY * Math.cos(7.5 * Math.PI / 180) * adjCP);       CP[17].py = CY - (curDY * Math.sin(7.5 * Math.PI / 180) * adjCP);
	CP[18] = {};    CP[18].px = CX + (curDY * Math.cos(7.5 * Math.PI / 180) * adjCP);       CP[18].py = CY + (curDY * Math.sin(7.5 * Math.PI / 180) * adjCP);
	CP[19] = {};    CP[19].px = CX + (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);      CP[19].py = CY + (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);
	CP[20] = {};    CP[20].px = CX + (curDY * Math.cos(37.5 * Math.PI / 180) * adjCP);      CP[20].py = CY + (curDY * Math.sin(37.5 * Math.PI / 180) * adjCP);
	CP[21] = {};    CP[21].px = CX + (curDY * Math.sin(37.5 * Math.PI / 180) * adjCP);      CP[21].py = CY + (curDY * Math.cos(37.5 * Math.PI / 180) * adjCP);
	CP[22] = {};    CP[22].px = CX + (curDY * Math.sin(22.5 * Math.PI / 180) * adjCP);      CP[22].py = CY + (curDY * Math.cos(22.5 * Math.PI / 180) * adjCP);
	CP[23] = {};    CP[23].px = CX + (curDY * Math.sin(7.5 * Math.PI / 180) * adjCP);       CP[23].py = CY + (curDY * Math.cos(7.5 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0.37;         VP[0].py = 0.98;
	VP[1] = {};     VP[1].px = 0.24;         VP[1].py = 0.94;
	VP[2] = {};     VP[2].px = 0.14;         VP[2].py = 0.86;
	VP[3] = {};     VP[3].px = 0.06;         VP[3].py = 0.75;
	VP[4] = {};     VP[4].px = 0.02;         VP[4].py = 0.63;
	VP[5] = {};     VP[5].px = 0.00;         VP[5].py = 0.50;
	VP[6] = {};     VP[6].px = 0.02;         VP[6].py = 0.37;
	VP[7] = {};     VP[7].px = 0.06;         VP[7].py = 0.25;
	VP[8] = {};     VP[8].px = 0.14;         VP[8].py = 0.14;
	VP[9] = {};     VP[9].px = 0.24;         VP[9].py = 0.06;
	VP[10] = {};    VP[10].px = 0.37;        VP[10].py = 0.02;
	VP[11] = {};    VP[11].px = 0.50;        VP[11].py = 0.00;
	VP[12] = {};    VP[12].px = 0.63;        VP[12].py = 0.02;
	VP[13] = {};    VP[13].px = 0.76;        VP[13].py = 0.06;
	VP[14] = {};    VP[14].px = 0.86;        VP[14].py = 0.14;
	VP[15] = {};    VP[15].px = 0.94;        VP[15].py = 0.25;
	VP[16] = {};    VP[16].px = 0.98;        VP[16].py = 0.37;
	VP[17] = {};    VP[17].px = 1.00;        VP[17].py = 0.50;
	VP[18] = {};    VP[18].px = 0.98;        VP[18].py = 0.63;
	VP[19] = {};    VP[19].px = 0.94;        VP[19].py = 0.75;
	VP[20] = {};    VP[20].px = 0.86;        VP[20].py = 0.86;
	VP[21] = {};    VP[21].px = 0.76;        VP[21].py = 0.94;
	VP[22] = {};    VP[22].px = 0.63;        VP[22].py = 0.98;
	VP[23] = {};    VP[23].px = 0.50;        VP[23].py = 1.00;

	for (loop = 0; loop < 24; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width),  adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width),  adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width),      adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureThirtytwostar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {     // Thirtytwo star
	var c1 = getCoordValue(aryCoordset, "c1", "50", "87.50", width, height);    // Crack point : "C1, 50,87.50, 50,50, 50,99"
	if (c1.minX == 0 && c1.minY == 0 && c1.maxX == 0 && c1.maxY == 0) {         // Default setting
		c1.minX = 0.5;
		c1.minY = 0.5;
		c1.maxX = 0.5;
		c1.maxY = 1.0;
	}

	var CX = c1.curX;
	var CY = c1.minY;
	var curDY = c1.curY - c1.minY;
	var maxDY = c1.maxY - c1.minY;

	var CP = [];
	var adjust = 0.995;
	var adjCP = ((1 - adjust) / (1 - CY)) + adjust - (c1.curY * ((1 - adjust) / (1 - CY)));
	CP[0] = {};     CP[0].px = CX - (curDY * Math.sin(5.625 * Math.PI / 180) * adjCP);          CP[0].py = CY + (curDY * Math.cos(5.625 * Math.PI / 180) * adjCP);
	CP[1] = {};     CP[1].px = CX - (curDY * Math.sin(16.875 * Math.PI / 180) * adjCP);         CP[1].py = CY + (curDY * Math.cos(16.875 * Math.PI / 180) * adjCP);
	CP[2] = {};     CP[2].px = CX - (curDY * Math.sin(28.125 * Math.PI / 180) * adjCP);         CP[2].py = CY + (curDY * Math.cos(28.125 * Math.PI / 180) * adjCP);
	CP[3] = {};     CP[3].px = CX - (curDY * Math.sin(39.375 * Math.PI / 180) * adjCP);         CP[3].py = CY + (curDY * Math.cos(39.375 * Math.PI / 180) * adjCP);
	CP[4] = {};     CP[4].px = CX - (curDY * Math.cos(39.375 * Math.PI / 180) * adjCP);         CP[4].py = CY + (curDY * Math.sin(39.375 * Math.PI / 180) * adjCP);
	CP[5] = {};     CP[5].px = CX - (curDY * Math.cos(28.125 * Math.PI / 180) * adjCP);         CP[5].py = CY + (curDY * Math.sin(28.125 * Math.PI / 180) * adjCP);
	CP[6] = {};     CP[6].px = CX - (curDY * Math.cos(16.875 * Math.PI / 180) * adjCP);         CP[6].py = CY + (curDY * Math.sin(16.875 * Math.PI / 180) * adjCP);
	CP[7] = {};     CP[7].px = CX - (curDY * Math.cos(5.625 * Math.PI / 180) * adjCP);          CP[7].py = CY + (curDY * Math.sin(5.625 * Math.PI / 180) * adjCP);
	CP[8] = {};     CP[8].px = CX - (curDY * Math.cos(5.625 * Math.PI / 180) * adjCP);          CP[8].py = CY - (curDY * Math.sin(5.625 * Math.PI / 180) * adjCP);
	CP[9] = {};     CP[9].px = CX - (curDY * Math.cos(16.875 * Math.PI / 180) * adjCP);         CP[9].py = CY - (curDY * Math.sin(16.875 * Math.PI / 180) * adjCP);
	CP[10] = {};    CP[10].px = CX - (curDY * Math.cos(28.125 * Math.PI / 180) * adjCP);        CP[10].py = CY - (curDY * Math.sin(28.125 * Math.PI / 180) * adjCP);
	CP[11] = {};    CP[11].px = CX - (curDY * Math.cos(39.375 * Math.PI / 180) * adjCP);        CP[11].py = CY - (curDY * Math.sin(39.375 * Math.PI / 180) * adjCP);
	CP[12] = {};    CP[12].px = CX - (curDY * Math.sin(39.375 * Math.PI / 180) * adjCP);        CP[12].py = CY - (curDY * Math.cos(39.375 * Math.PI / 180) * adjCP);
	CP[13] = {};    CP[13].px = CX - (curDY * Math.sin(28.125 * Math.PI / 180) * adjCP);        CP[13].py = CY - (curDY * Math.cos(28.125 * Math.PI / 180) * adjCP);
	CP[14] = {};    CP[14].px = CX - (curDY * Math.sin(16.875 * Math.PI / 180) * adjCP);        CP[14].py = CY - (curDY * Math.cos(16.875 * Math.PI / 180) * adjCP);
	CP[15] = {};    CP[15].px = CX - (curDY * Math.sin(5.625 * Math.PI / 180) * adjCP);         CP[15].py = CY - (curDY * Math.cos(5.625 * Math.PI / 180) * adjCP);
	CP[16] = {};    CP[16].px = CX + (curDY * Math.sin(5.625 * Math.PI / 180) * adjCP);         CP[16].py = CY - (curDY * Math.cos(5.625 * Math.PI / 180) * adjCP);
	CP[17] = {};    CP[17].px = CX + (curDY * Math.sin(16.875 * Math.PI / 180) * adjCP);        CP[17].py = CY - (curDY * Math.cos(16.875 * Math.PI / 180) * adjCP);
	CP[18] = {};    CP[18].px = CX + (curDY * Math.sin(28.125 * Math.PI / 180) * adjCP);        CP[18].py = CY - (curDY * Math.cos(28.125 * Math.PI / 180) * adjCP);
	CP[19] = {};    CP[19].px = CX + (curDY * Math.sin(39.375 * Math.PI / 180) * adjCP);        CP[19].py = CY - (curDY * Math.cos(39.375 * Math.PI / 180) * adjCP);
	CP[20] = {};    CP[20].px = CX + (curDY * Math.cos(39.375 * Math.PI / 180) * adjCP);        CP[20].py = CY - (curDY * Math.sin(39.375 * Math.PI / 180) * adjCP);
	CP[21] = {};    CP[21].px = CX + (curDY * Math.cos(28.125 * Math.PI / 180) * adjCP);        CP[21].py = CY - (curDY * Math.sin(28.125 * Math.PI / 180) * adjCP);
	CP[22] = {};    CP[22].px = CX + (curDY * Math.cos(16.875 * Math.PI / 180) * adjCP);        CP[22].py = CY - (curDY * Math.sin(16.875 * Math.PI / 180) * adjCP);
	CP[23] = {};    CP[23].px = CX + (curDY * Math.cos(5.625 * Math.PI / 180) * adjCP);         CP[23].py = CY - (curDY * Math.sin(5.625 * Math.PI / 180) * adjCP);
	CP[24] = {};    CP[24].px = CX + (curDY * Math.cos(5.625 * Math.PI / 180) * adjCP);         CP[24].py = CY + (curDY * Math.sin(5.625 * Math.PI / 180) * adjCP);
	CP[25] = {};    CP[25].px = CX + (curDY * Math.cos(16.875 * Math.PI / 180) * adjCP);        CP[25].py = CY + (curDY * Math.sin(16.875 * Math.PI / 180) * adjCP);
	CP[26] = {};    CP[26].px = CX + (curDY * Math.cos(28.125 * Math.PI / 180) * adjCP);        CP[26].py = CY + (curDY * Math.sin(28.125 * Math.PI / 180) * adjCP);
	CP[27] = {};    CP[27].px = CX + (curDY * Math.cos(39.375 * Math.PI / 180) * adjCP);        CP[27].py = CY + (curDY * Math.sin(39.375 * Math.PI / 180) * adjCP);
	CP[28] = {};    CP[28].px = CX + (curDY * Math.sin(39.375 * Math.PI / 180) * adjCP);        CP[28].py = CY + (curDY * Math.cos(39.375 * Math.PI / 180) * adjCP);
	CP[29] = {};    CP[29].px = CX + (curDY * Math.sin(28.125 * Math.PI / 180) * adjCP);        CP[29].py = CY + (curDY * Math.cos(28.125 * Math.PI / 180) * adjCP);
	CP[30] = {};    CP[30].px = CX + (curDY * Math.sin(16.875 * Math.PI / 180) * adjCP);        CP[30].py = CY + (curDY * Math.cos(16.875 * Math.PI / 180) * adjCP);
	CP[31] = {};    CP[31].px = CX + (curDY * Math.sin(5.625 * Math.PI / 180) * adjCP);         CP[31].py = CY + (curDY * Math.cos(5.625 * Math.PI / 180) * adjCP);

	var VP = [];
	VP[0] = {};     VP[0].px = 0.40;         VP[0].py = 0.99;
	VP[1] = {};     VP[1].px = 0.31;         VP[1].py = 0.96;
	VP[2] = {};     VP[2].px = 0.22;         VP[2].py = 0.92;
	VP[3] = {};     VP[3].px = 0.14;         VP[3].py = 0.86;
	VP[4] = {};     VP[4].px = 0.08;         VP[4].py = 0.78;
	VP[5] = {};     VP[5].px = 0.04;         VP[5].py = 0.69;
	VP[6] = {};     VP[6].px = 0.01;         VP[6].py = 0.60;
	VP[7] = {};     VP[7].px = 0.00;         VP[7].py = 0.50;
	VP[8] = {};     VP[8].px = 0.01;         VP[8].py = 0.40;
	VP[9] = {};     VP[9].px = 0.04;         VP[9].py = 0.31;
	VP[10] = {};    VP[10].px = 0.08;        VP[10].py = 0.22;
	VP[11] = {};    VP[11].px = 0.14;        VP[11].py = 0.14;
	VP[12] = {};    VP[12].px = 0.22;        VP[12].py = 0.08;
	VP[13] = {};    VP[13].px = 0.31;        VP[13].py = 0.04;
	VP[14] = {};    VP[14].px = 0.40;        VP[14].py = 0.01;
	VP[15] = {};    VP[15].px = 0.50;        VP[15].py = 0.00;
	VP[16] = {};    VP[16].px = 0.60;        VP[16].py = 0.01;
	VP[17] = {};    VP[17].px = 0.69;        VP[17].py = 0.04;
	VP[18] = {};    VP[18].px = 0.78;        VP[18].py = 0.08;
	VP[19] = {};    VP[19].px = 0.86;        VP[19].py = 0.14;
	VP[20] = {};    VP[20].px = 0.92;        VP[20].py = 0.22;
	VP[21] = {};    VP[21].px = 0.96;        VP[21].py = 0.31;
	VP[22] = {};    VP[22].px = 0.99;        VP[22].py = 0.40;
	VP[23] = {};    VP[23].px = 1.00;        VP[23].py = 0.50;
	VP[24] = {};    VP[24].px = 0.99;        VP[24].py = 0.60;
	VP[25] = {};    VP[25].px = 0.96;        VP[25].py = 0.69;
	VP[26] = {};    VP[26].px = 0.92;        VP[26].py = 0.78;
	VP[27] = {};    VP[27].px = 0.86;        VP[27].py = 0.86;
	VP[28] = {};    VP[28].px = 0.78;        VP[28].py = 0.92;
	VP[29] = {};    VP[29].px = 0.69;        VP[29].py = 0.96;
	VP[30] = {};    VP[30].px = 0.60;        VP[30].py = 0.99;
	VP[31] = {};    VP[31].px = 0.50;        VP[31].py = 1.00;

	for (loop = 0; loop < 32; loop++) {
		if (loop != 0 && !same_CP(CP[loop], CP[loop - 1], border, width, height))
			ctx.lineTo(adjVal(width * CP[loop].px, border, width),  adjVal(height * CP[loop].py, border, height));
		else
			ctx.moveTo(adjVal(width * CP[loop].px, border, width),  adjVal(height * CP[loop].py, border, height));
		ctx.lineTo(adjVal(width * VP[loop].px, border, width),      adjVal(height * VP[loop].py, border, height));
	}
}

function drawFigureSingleArrow(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var t1 = getCoordValue(aryCoordset, "t1", "0", "25", ex, ey);    // Thickness point : "T1, 0,25, 0,0, 0,50"
	var c1 = getCoordValue(aryCoordset, "c1", "0", "50", ex, ey);    // Crack point : "C1, 0,50, 0,50, W1,50"
	var w1 = getCoordValue(aryCoordset, "w1", "50", "0", ex, ey);    //Wings Point : "W1, 50,0, C1,0, 100,0"

	// Basic Drawing |[|/
	ctx.moveTo(adjVal(sx + (width * w1.curX), border, ex),      adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx + (width * w1.curX), border, ex),      adjVal(sy + (height * t1.curY), border, ey));
	ctx.lineTo(adjVal(sx, border, ex),                          adjVal(sy + (height * t1.curY), border, ey));
	ctx.lineTo(adjVal(sx + (width * c1.curX), border, ex),      adjVal(sy + (height * c1.curY), border, ey));
	ctx.lineTo(adjVal(sx, border, ex),                          adjVal(sy + (height * (1 - t1.curY)), border, ey));
	ctx.lineTo(adjVal(sx + (width * w1.curX), border, ex),      adjVal(sy + (height * (1 - t1.curY)), border, ey));
	ctx.lineTo(adjVal(sx + (width * w1.curX), border, ex),      adjVal(ey, border, ey));
	ctx.lineTo(adjVal(ex, border, ex),                          adjVal(sy + (height / 2), border, ey));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing complement (= overlap)
	if (same_y(t1.curY, 1 - t1.curY, border, ey)) {
		ctx.moveTo(adjVal(sx, border, ex),                      adjVal(sy + (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(sx + (width * w1.curX), border, ex),  adjVal(sy + (height * t1.curY), border, ey));
	}
	// Drawing supplement (right:> nested)
	if (same_x(w1.curX, 1, border, ex)) {
		ctx.moveTo(adjVal(ex, border, ex),                      adjVal(sy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),                      adjVal(ey, border, ey));
	}
	ctx.moveTo(adjVal(sx, border, ex),                          adjVal(sy, border, ey)); // Path End.
}

function drawFigureDoubleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var w1 = getCoordValue(aryCoordset, "w1", "30", "0", width, height);       //Wings Point : "W1, 30,0, 0,0, 50,0"
	var t1 = getCoordValue(aryCoordset, "t1", "50", "30", width, height);      // Thickness point : "T1, 50,30, 50,0, 50,50"

	// Basic construct <| - |> | -
	ctx.moveTo(adjVal(width * w1.curX, border, width),          adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),          adjVal(height, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),          adjVal(height * (1 - t1.curY), border, height));
	ctx.lineTo(adjVal(width * (1 - w1.curX), border, width),    adjVal(height * (1 - t1.curY), border, height));
	ctx.lineTo(adjVal(width * (1 - w1.curX), border, width),    adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width * (1 - w1.curX), border, width),    adjVal(0, border, height));
	ctx.lineTo(adjVal(width * (1 - w1.curX), border, width),    adjVal(height * t1.curY, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),          adjVal(height * t1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing supplement (both <: and:> nested)
	if (same_x(w1.curX, 0, border, width)) {
		ctx.moveTo(adjVal(0, border, width),                        adjVal(0, border, height));
		ctx.lineTo(adjVal(0, border, width),                        adjVal(height, border, height));
		ctx.moveTo(adjVal(width, border, width),                    adjVal(0, border, height));
		ctx.lineTo(adjVal(width, border, width),                    adjVal(height, border, height));
	}
	// Drawing supplement (center :: Nested)
	if (same_x(w1.curX, 1 - w1.curX, border, width)) {
		ctx.moveTo(adjVal(width * w1.curX, border, width),          adjVal(height * (1 - t1.curY), border, height));
		ctx.lineTo(adjVal(width * w1.curX, border, width),          adjVal(height, border, height));
	}
	// Drawing supplement (middle = nesting)
	if (same_y(t1.curY, 1 - t1.curY, border, height)) {
		ctx.moveTo(adjVal(width * w1.curX, border, width),          adjVal(height * t1.curY, border, height));
		ctx.lineTo(adjVal(width * (1 - w1.curX), border, width),    adjVal(height * t1.curY, border, height));
	}
	ctx.moveTo(adjVal(0, border, width),                            adjVal(0, border, height)); // Path End.
}

function drawFigureSlopeSingleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var t1 = getCoordValue(aryCoordset, "t1", "0", "0", width, height);     // Thickness point : "T1, 0,0, 0,0, 0,50"
	var c1 = getCoordValue(aryCoordset, "c1", "0", "50", width, height);    // Crack point : "C1, 0,50, 0,50, W1,50"
	var w1 = getCoordValue(aryCoordset, "w1", "50", "0", width, height);    //Wings Point : "W1, 50,0, C1,0, 100,0"

	var t2y = w1.curX * (0.5 - t1.curY) + t1.curY;

	// Basic Drawing | [ | /
	ctx.moveTo(adjVal(width * w1.curX, border, width),      adjVal(0, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),      adjVal(height * t2y, border, height));
	ctx.lineTo(adjVal(0, border, width),                    adjVal(height * t1.curY, border, height));
	ctx.lineTo(adjVal(width * c1.curX, border, width),      adjVal(height * c1.curY, border, height));
	ctx.lineTo(adjVal(0, border, width),                    adjVal(height * (1 - t1.curY), border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),      adjVal(height * (1 - t2y), border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),      adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(height / 2, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing complement (= overlap)
	if (same_y(t1.curY, 1 - t1.curY, border, height)) {
		ctx.moveTo(adjVal(0, border, width),                adjVal(height * t1.curY, border, height));
		ctx.lineTo(adjVal(width * w1.curX, border, width),  adjVal(height * t1.curY, border, height));
	}
	// Drawing complement (left >> nested)
	if (same_y(c1.curX, 1, border, width)) {
		ctx.moveTo(adjVal(0, border, width),                adjVal(height * t1.curY, border, height));
		ctx.lineTo(adjVal(width * w1.curX, border, width),  adjVal(height * t2y, border, height));
		ctx.moveTo(adjVal(0, border, width),                adjVal(height * (1 - t1.curY), border, height));
		ctx.lineTo(adjVal(width * w1.curX, border, width),  adjVal(height * t2y, border, height));
	}
	// Drawing supplement (right:> nested)
	if (same_x(w1.curX, 1, border, width)) {
		ctx.moveTo(adjVal(width, border, width),            adjVal(0, border, height));
		ctx.lineTo(adjVal(width, border, width),            adjVal(height, border, height));
	}
	ctx.moveTo(adjVal(0, border, width),                    adjVal(0, border, height)); // Path End.
}

function drawFigureTurnSingleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var a1 = getCoordValue(aryCoordset, "a1", "75", "0", width, height);       //vertex : "A1, 75,0, 50,0, 100,0"
	var w1 = getCoordValue(aryCoordset, "w1", "100", "25", width, height);     //Wings Point : "W1, 100,25, 100,0, 100,50"
	var t1 = getCoordValue(aryCoordset, "t1", "87.5", "100", width, height);   // Thickness point1 : "T1, 87.5,100, A1,100, 100,100"
	var t2 = getCoordValue(aryCoordset, "t2", "0", "75", width, height);       // Thickness point2 : "T2, 0,75, 0,50, 0,100"

	// Basic Drawing / _ | - | - | -
	ctx.moveTo(adjVal(width * a1.curX, border, width),                          adjVal(0, border, height));
	ctx.lineTo(adjVal(width * (1 - ((1 - a1.curX) * 2)), border, width),        adjVal(height * w1.curY, border, height));
	ctx.lineTo(adjVal(width * (a1.curX - (t1.curX - a1.curX)), border, width),  adjVal(height * w1.curY, border, height));
	ctx.lineTo(adjVal(width * (a1.curX - (t1.curX - a1.curX)), border, width),  adjVal(height * t2.curY, border, height));
	ctx.lineTo(adjVal(0, border, width),                                        adjVal(height * t2.curY, border, height));
	ctx.lineTo(adjVal(0, border, width),                                        adjVal(height, border, height));
	ctx.lineTo(adjVal(width * t1.curX, border, width),                          adjVal(height, border, height));
	ctx.lineTo(adjVal(width * t1.curX, border, width),                          adjVal(height * w1.curY, border, height));
	ctx.lineTo(adjVal(width, border, width),                                    adjVal(height * w1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing complement (top ^ .. nesting)
	if (same_y(a1.curY, w1.curY, border, height)) {
		ctx.moveTo(adjVal(width * (1 - ((1 - a1.curX) * 2)), border, width),    adjVal(height * w1.curY, border, height));
		ctx.lineTo(adjVal(width * a1.curX, border, width),                      adjVal(height * w1.curY, border, height));
	}
	// Drawing complement (top .. = nesting)
	if (same_y(t2.curY, w1.curY, border, height)) {
		ctx.moveTo(adjVal(width * (1 - ((1 - a1.curX) * 2)), border, width),        adjVal(height * w1.curY, border, height));
		ctx.lineTo(adjVal(width * (a1.curX - (t1.curX - a1.curX)), border, width),  adjVal(height * w1.curY, border, height));
	}
	// Drawing complement (= overlap)
	if (same_y(t2.curY, 1, border, height)) {
		ctx.moveTo(adjVal(0, border, width),                                    adjVal(height, border, height));
		ctx.lineTo(adjVal(width * t1.curX, border, width),                      adjVal(height, border, height));
		// Drawing supplement (|| overlap)
		if (same_x(a1.curX - (t1.curX - a1.curX), t1.curX, border, width)) {
			ctx.moveTo(adjVal(width * t1.curX, border, width),                  adjVal(height, border, height));
			ctx.lineTo(adjVal(width * t1.curX, border, width),                  adjVal(height * w1.curY, border, height));
		}
	}
	ctx.moveTo(adjVal(0, border, width),                                        adjVal(0, border, height)); // Path End.
}

function drawFigureTurnDoubleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var a1 = getCoordValue(aryCoordset, "a1", "75", "0", width, height);       //vertex1 : "A1, 75,0, 75,0, 100,0"
	var w1 = getCoordValue(aryCoordset, "w1", "100", "25", width, height);     //Wings Point1 : "W1, 100,25, 100,0, 100,50"
	var t1 = getCoordValue(aryCoordset, "t1", "87.5", "50", width, height);    // Thickness point1 : "T1, 87.5,50, A1,50, 100,50"
	var a2 = getCoordValue(aryCoordset, "a2", "0", "75", width, height);       //vertex2 : "A2, 0,75, 0,75, 0,100"
	var w2 = getCoordValue(aryCoordset, "w2", "25", "100", width, height);     //Wings Point2 : "W2, 25,100, 0,100, 50,100"
	var t2 = getCoordValue(aryCoordset, "t2", "50", "87.5", width, height);    // Thickness point2 : "T2, 50,87.5, 50,A2, 50,100"

	// Basic Drawing / _ | - | <| - | _
	ctx.moveTo(adjVal(width * a1.curX, border, width),                          adjVal(0, border, height));
	ctx.lineTo(adjVal(width * (1 - ((1 - a1.curX) * 2)), border, width),        adjVal(height * w1.curY, border, height));
	ctx.lineTo(adjVal(width * (a1.curX - (t1.curX - a1.curX)), border, width),  adjVal(height * w1.curY, border, height));
	ctx.lineTo(adjVal(width * (a1.curX - (t1.curX - a1.curX)), border, width),  adjVal(height * (a2.curY - (t2.curY - a2.curY)), border, height));
	ctx.lineTo(adjVal(width * w2.curX, border, width),                          adjVal(height * (a2.curY - (t2.curY - a2.curY)), border, height));
	ctx.lineTo(adjVal(width * w2.curX, border, width),                          adjVal(height * (1 - ((1 - a2.curY) * 2)), border, height));
	ctx.lineTo(adjVal(0, border, width),                                        adjVal(height * a2.curY, border, height));
	ctx.lineTo(adjVal(width * w2.curX, border, width),                          adjVal(height, border, height));
	ctx.lineTo(adjVal(width * w2.curX, border, width),                          adjVal(height * t2.curY, border, height));
	ctx.lineTo(adjVal(width * t1.curX, border, width),                          adjVal(height * t2.curY, border, height));
	ctx.lineTo(adjVal(width * t1.curX, border, width),                          adjVal(height * w1.curY, border, height));
	ctx.lineTo(adjVal(width, border, width),                                    adjVal(height * w1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing complement (top ^ .. nesting)
	if (same_y(a1.curY, w1.curY, border, height)) {
		ctx.moveTo(adjVal(width * (1 - ((1 - a1.curX) * 2)), border, width),    adjVal(height * w1.curY, border, height));
		ctx.lineTo(adjVal(width * a1.curX, border, width),                      adjVal(height * w1.curY, border, height));
	}
	// Drawing complement (left <: nested)
	if (same_x(a2.curX, w2.curX, border, width)) {
		ctx.moveTo(adjVal(width * a2.curX, border, width),                      adjVal(height * (1 - ((1 - a2.curY) * 2)), border, height));
		ctx.lineTo(adjVal(width * a2.curX, border, width),                      adjVal(height, border, height));
	}
	// Drawing complement (= overlap)
	if (same_y(a2.curY, t2.curY, border, height)) {
		ctx.moveTo(adjVal(width * w2.curX, border, width),                          adjVal(height * t2.curY, border, height));
		ctx.lineTo(adjVal(width * (a1.curX - (t1.curX - a1.curX)), border, width),  adjVal(height * t2.curY, border, height));
	}
	// Drawing complement (left <nested)
	if (same_y(a2.curY, 1, border, height)) {
		ctx.moveTo(adjVal(width * a2.curX, border, width),                      adjVal(height, border, height));
		ctx.lineTo(adjVal(width * w2.curX, border, width),                      adjVal(height, border, height));
		// Drawing supplement (|| overlap)
		if (same_x(a1.curX - (t1.curX - a1.curX), t1.curX, border, width)) {
			ctx.moveTo(adjVal(width * t1.curX, border, width),                  adjVal(height, border, height));
			ctx.lineTo(adjVal(width * t1.curX, border, width),                  adjVal(height * w1.curY, border, height));
		}
	}
	ctx.moveTo(adjVal(0, border, width),                                        adjVal(0, border, height)); // Path End.
}

function drawFigureCurveSingleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var t1 = getCoordValue(aryCoordset, "t1", "100", "25", width, height);    // Thickness point : "T1, 100,25, 100,0, 100,50"
	var a1 = getCoordValue(aryCoordset, "a1", "100", "75", width, height);    //vertex : "A1, 100,75, 100,50, 100,100-T1/2"
	var w1 = getCoordValue(aryCoordset, "w1", "75", "100", width, height);    //Wings Point : "W1, 75,100, 50,100, 100,100"

	a1.curY = Math.min(a1.curY, 1 - (t1.curY / 2));

	var thickness = height * t1.curY;
	var centerY1 = height * (1 - t1.curY - ((1 - a1.curY) / 2)) / 2;
	var centerY2 = centerY1 + thickness;

	var startX = width;
	var startY = 0;
	var endX = 0;
	var endY = centerY1;

	var bezier1X = startX / 2;
	var bezier1Y = centerY1 / 4;
	var bezier2X = endX;
	var bezier2Y = centerY1 / 2;

	// Basic Drawing 1 ~ | ~
	ctx.moveTo(adjVal(startX, border, width),           adjVal(startY, border, height));
	ctx.bezierCurveTo(adjVal(bezier1X, border, width),  adjVal(bezier1Y, border, height),               adjVal(bezier2X, border, width),    adjVal(bezier2Y, border, height),               adjVal(endX, border, width),    adjVal(endY, border, height));
	ctx.lineTo(adjVal(endX, border, width),             adjVal(endY + thickness, border, height));
	ctx.bezierCurveTo(adjVal(bezier2X, border, width),  adjVal(bezier2Y + thickness, border, height),   adjVal(bezier1X, border, width),    adjVal(bezier1Y + thickness, border, height),   adjVal(startX, border, width),  adjVal(startY + thickness, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	startX = 0;
	startY = centerY1;
	endX = width * w1.curX;
	endY = height * (a1.curY - (t1.curY / 2));

	bezier1X = startX;
	bezier1Y = startY + ((endY - startY) / 2);
	bezier2X = endX / 2;
	bezier2Y = startY + ((endY - startY) * 3 / 4);

	var halfwing = (height * (1 - a1.curY)) - (thickness / 2);

	// Basic Drawing 2 ~ |> | ~
	ctx.moveTo(adjVal(startX, border, width),           adjVal(startY, border, height));
	ctx.bezierCurveTo(adjVal(bezier1X, border, width),  adjVal(bezier1Y, border, height),               adjVal(bezier2X, border, width),    adjVal(bezier2Y, border, height),               adjVal(endX, border, width),    adjVal(endY, border, height));
	ctx.lineTo(adjVal(endX, border, width),             adjVal(endY - halfwing, border, height));
	ctx.lineTo(adjVal(width, border, width),            adjVal(height * a1.curY, border, height));
	ctx.lineTo(adjVal(endX, border, width),             adjVal(endY + thickness + halfwing, border, height));
	ctx.lineTo(adjVal(endX, border, width),             adjVal(endY + thickness, border, height));
	ctx.bezierCurveTo(adjVal(bezier2X, border, width),  adjVal(bezier2Y + thickness, border, height),   adjVal(bezier1X, border, width),    adjVal(bezier1Y + thickness, border, height),   adjVal(startX, border, width),  adjVal(startY + thickness, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing supplement (right:> nested)
	if (same_x(w1.curX, 1, border, width)) {
		ctx.moveTo(adjVal(width, border, width),        adjVal(endY - halfwing, border, height));
		ctx.lineTo(adjVal(width, border, width),        adjVal(height, border, height));
	}
	// Drawing supplement (right> nested)
	if (same_x(a1.curY, 1, border, height)) {
		ctx.moveTo(adjVal(endX, border, width),         adjVal(height, border, height));
		ctx.lineTo(adjVal(width, border, width),        adjVal(height, border, height));
	}
	ctx.moveTo(adjVal(0, border, width),                adjVal(0, border, height)); // Path End.
}

function drawFigureStripedArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var t1 = getCoordValue(aryCoordset, "t1", "0", "25", width, height);    // Thickness point : "T1, 0,25, 0,0, 0,50"
	var w1 = getCoordValue(aryCoordset, "w1", "50", "0", width, height);    //Wings Point : "W1, 50,0, 25,0, 100,0"

	var stripWidth = Math.min(width * w1.curX / 2, 80);      //Fixing the maximum width of stripping to 80px

	// Basic Drawing 1 | [ | /
	ctx.moveTo(adjVal(width * w1.curX, border, width),      adjVal(0, border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),      adjVal(height * t1.curY, border, height));
	ctx.lineTo(adjVal(stripWidth, border, width),           adjVal(height * t1.curY, border, height));
	ctx.lineTo(adjVal(stripWidth, border, width),           adjVal(height * (1 - t1.curY), border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),      adjVal(height * (1 - t1.curY), border, height));
	ctx.lineTo(adjVal(width * w1.curX, border, width),      adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(height / 2, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing complement (= overlap)
	if (same_y(t1.curY, 1 - t1.curY, border, height)) {
		ctx.moveTo(adjVal(stripWidth, border, width),       adjVal(height * t1.curY, border, height));
		ctx.lineTo(adjVal(width * w1.curX, border, width),  adjVal(height * t1.curY, border, height));
	}
// Drawing supplement (right:> nested)
	if (same_x(w1.curX, 1, border, width)) {
		ctx.moveTo(adjVal(width, border, width),            adjVal(0, border, height));
		ctx.lineTo(adjVal(width, border, width),            adjVal(height, border, height));
	}
	ctx.moveTo(adjVal(0, border, width),                    adjVal(0, border, height)); // Path End.

	// Basic Drawing 2 □
	ctx.moveTo(adjVal(stripWidth * 2 / 5, border, width),   adjVal(height * t1.curY, border, height));
	ctx.lineTo(adjVal(stripWidth * 2 / 5, border, width),   adjVal(height * (1 - t1.curY), border, height));
	ctx.lineTo(adjVal(stripWidth * 4 / 5, border, width),   adjVal(height * (1 - t1.curY), border, height));
	ctx.lineTo(adjVal(stripWidth * 4 / 5, border, width),   adjVal(height * t1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Basic Drawing 3 □
	ctx.moveTo(adjVal(0, border, width),                    adjVal(height * t1.curY, border, height));
	ctx.lineTo(adjVal(0, border, width),                    adjVal(height * (1 - t1.curY), border, height));
	ctx.lineTo(adjVal(stripWidth / 5, border, width),       adjVal(height * (1 - t1.curY), border, height));
	ctx.lineTo(adjVal(stripWidth / 5, border, width),       adjVal(height * t1.curY, border, height));
}

function drawFigureMemoboxRect(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var h1 = getCoordValue(aryCoordset, "h1", "0", "85", width, height);       //height point : "H1, 0,85, 0,0, 0,100"
	var v1 = getCoordValue(aryCoordset, "v1", "37.5", "100", width, height);   //vertex : "V1, 37.5,100, 0,100, 100,100"
	var c1 = getCoordValue(aryCoordset, "c1", "25", "h1", width, height);      // Crack point1 : "C1, 25,H1, 0,H1, C2,H1"
	var c2 = getCoordValue(aryCoordset, "c2", "50", "h1", width, height);      // Crack point2 : "C2, 50,H1, C1,H1, 100,H1"

	// Basic Drawing [V]
	ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
	ctx.arcTo(adjVal(0, border, width),                 adjVal(0, border, height),                  adjVal(0, border, width),                   adjVal(height / 2, border, height),         0);
	ctx.arcTo(adjVal(0, border, width),                 adjVal(height * h1.curY, border, height),   adjVal(width * c1.curX, border, width),     adjVal(height * h1.curY, border, height),   0);
	ctx.lineTo(adjVal(width * c1.curX, border, width),  adjVal(height * h1.curY, border, height));
	ctx.lineTo(adjVal(width * v1.curX, border, width),  adjVal(height, border, height));
	ctx.lineTo(adjVal(width * c2.curX, border, width),  adjVal(height * h1.curY, border, height));
	ctx.arcTo(adjVal(width, border, width),             adjVal(height * h1.curY, border, height),   adjVal(width, border, width),               adjVal(height / 2, border, height),         0);
	ctx.arcTo(adjVal(width, border, width),             adjVal(0, border, height),                  adjVal(width / 2, border, width),           adjVal(0, border, height),                  0);
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing complement (= overlap)
	if (same_y(h1.curY, 0, border, height)) {
		ctx.moveTo(adjVal(0, border, width),                adjVal(0, border, height));
		ctx.lineTo(adjVal(width * c1.curX, border, width),  adjVal(0, border, height));
	}
	// Drawing complement (V nested)
	if (same_X(c1, c2, border, width)) {
		ctx.moveTo(adjVal(width * c1.curX, border, width),  adjVal(height * c1.curY, border, height));
		ctx.lineTo(adjVal(width * v1.curX, border, width),  adjVal(height * v1.curY, border, height));
	}
	ctx.moveTo(adjVal(0, border, width),                    adjVal(0, border, height)); // Path End.
}

function drawFigureMemoboxRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var f1 = getCoordValue(aryCoordset, "f1", "10", "0", width, height);       //Inflection point : "F1, 10,0, 0,0, 50@MIN(100_W:H1_Y),0"
	var h1 = getCoordValue(aryCoordset, "h1", "0", "85", width, height);       //Height point : "H1, 0,85, 0,0, 0,100"
	var v1 = getCoordValue(aryCoordset, "v1", "37.5", "100", width, height);   //vertex : "V1, 37.5,100, 0,100, 100,100"
	var c1 = getCoordValue(aryCoordset, "c1", "25", "h1", width, height);      // Crack point1 : "C1, 25,H1, F1,H1, C2,H1"
	var c2 = getCoordValue(aryCoordset, "c2", "50", "h1", width, height);      // Crack point2 : "C2, 50,H1, C1,H1, 100-F1,H1"

	var radius = Math.min(Math.min(width / 2, height * h1.curY / 2), width * f1.curX);

	// Basic Drawing (V)
	ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
	ctx.arcTo(adjVal(0, border, width),                 adjVal(0, border, height),                  adjVal(0, border, width),                   adjVal(height * h1.curY / 2, border, height),   radius);
	ctx.arcTo(adjVal(0, border, width),                 adjVal(height * h1.curY, border, height),   adjVal(width * c1.curX, border, width),     adjVal(height * h1.curY, border, height),       radius);
	ctx.lineTo(adjVal(width * c1.curX, border, width),  adjVal(height * h1.curY, border, height));
	ctx.lineTo(adjVal(width * v1.curX, border, width),  adjVal(height, border, height));
	ctx.lineTo(adjVal(width * c2.curX, border, width),  adjVal(height * h1.curY, border, height));
	ctx.arcTo(adjVal(width, border, width),             adjVal(height * h1.curY, border, height),   adjVal(width, border, width),               adjVal(height * h1.curY / 2, border, height),   radius);
	ctx.arcTo(adjVal(width, border, width),             adjVal(0, border, height),                  adjVal(width / 2, border, width),           adjVal(0, border, height),                      radius);
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing complement (= overlap)
	if (same_y(h1.curY, 0, border, height)) {
		ctx.moveTo(adjVal(0, border, width),                adjVal(0, border, height));
		ctx.lineTo(adjVal(width * c1.curX, border, width),  adjVal(0, border, height));
	}
	// Drawing complement (V nested)
	if (same_X(c1, c2, border, width)) {
		ctx.moveTo(adjVal(width * c1.curX, border, width),  adjVal(height * c1.curY, border, height));
		ctx.lineTo(adjVal(width * v1.curX, border, width),  adjVal(height * v1.curY, border, height));
	}
	ctx.moveTo(adjVal(0, border, width),                    adjVal(0, border, height)); // Path End.
}

function drawFigureMemoboxCloud(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var h1 = getCoordValue(aryCoordset, "h1", "0", "85", width, height);        //Height point : "H1, 0,85, 0,0, 0,100"
	var v1 = getCoordValue(aryCoordset, "v1", "37.5", "100", width, height);    //vertex : "V1, 37.5,100, 0,100, 100,100"
	var c1 = getCoordValue(aryCoordset, "c1", "25", "h1", width, height);       // Crack point1 : "C1, 25,H1, 10,H1, C2,H1"
	var c2 = getCoordValue(aryCoordset, "c2", "50", "h1", width, height);       // Crack point2 : "C2, 50,H1, C1,H1, 90,H1"

	var BP = [];
	BP[0] = {};     BP[0].spx = c1.minX;    BP[0].spy = h1.curY * 1.00;            
	BP[1] = {};     BP[1].spx = 0.00;       BP[1].spy = h1.curY * 0.75;        
	BP[2] = {};     BP[2].spx = c1.minX;    BP[2].spy = h1.curY * 0.50;        
	BP[3] = {};     BP[3].spx = 0.33;       BP[3].spy = h1.curY * 0.00;               
	BP[4] = {};     BP[4].spx = 0.66;       BP[4].spy = h1.curY * 0.33;        
	BP[5] = {};     BP[5].spx = c2.maxX;    BP[5].spy = h1.curY * 0.66;    
	BP[6] = {};     BP[6].spx = 1.00;       BP[6].spy = h1.curY * 0.83;

	BP[0].b1x = BP[0].spx + ((BP[1].spx - BP[0].spx) * 0.5);    BP[0].b1y = BP[0].spy;                                      BP[0].b2x = BP[1].spx;                                      BP[0].b2y = BP[0].spy + ((BP[1].spy - BP[0].spy) * 0.5);
	BP[1].b1x = BP[1].spx;                                      BP[1].b1y = BP[1].spy + ((BP[2].spy - BP[1].spy) * 0.5);    BP[1].b2x = BP[1].spx + ((BP[2].spx - BP[1].spx) * 0.5);    BP[1].b2y = BP[2].spy;
	BP[2].b1x = BP[2].spx + ((BP[3].spx - BP[2].spx) * 0.1);    BP[2].b1y = BP[2].spy + ((BP[3].spy - BP[2].spy) * 0.5);    BP[2].b2x = BP[2].spx + ((BP[3].spx - BP[2].spx) * 0.5);    BP[2].b2y = BP[3].spy;
	BP[3].b1x = BP[3].spx + ((BP[4].spx - BP[3].spx) * 0.5);    BP[3].b1y = BP[3].spy;                                      BP[3].b2x = BP[4].spx - ((BP[4].spx - BP[3].spx) * 0.1);    BP[3].b2y = BP[3].spy + ((BP[4].spy - BP[3].spy) * 0.5);
	BP[4].b1x = BP[4].spx + ((BP[5].spx - BP[4].spx) * 0.5);    BP[4].b1y = BP[4].spy - ((BP[5].spy - BP[4].spy) * 0.33);   BP[4].b2x = BP[5].spx;                                      BP[4].b2y = BP[4].b1y;
	BP[5].b1x = BP[5].spx + ((BP[6].spx - BP[5].spx) * 0.5);    BP[5].b1y = BP[5].spy;                                      BP[5].b2x = BP[6].spx;                                      BP[5].b2y = BP[5].spy + ((BP[6].spy - BP[6].spy) * 0.5);
	BP[6].b1x = BP[6].spx;                                      BP[6].b1y = BP[6].spy + ((BP[0].spy - BP[6].spy) * 0.5);    BP[6].b2x = BP[6].spx + ((BP[5].spx - BP[6].spx) * 0.5);    BP[6].b2y = BP[0].spy;

	// {} Constructions
	for (loop = 0; loop <= 6; loop++) {
		if (loop == 0)
			ctx.moveTo(adjVal(width * BP[loop].spx, border, width),           adjVal(height * BP[loop].spy, border, height));
		if (loop == 6)
			ctx.bezierCurveTo(adjVal(width * BP[loop].b1x, border, width),    adjVal(height * BP[loop].b1y, border, height),    adjVal(width * BP[loop].b2x, border, width),      adjVal(height * BP[loop].b2y, border, height),    adjVal(width * c2.maxX, border, width),         adjVal(height * h1.curY, border, height));
		else
			ctx.bezierCurveTo(adjVal(width * BP[loop].b1x, border, width),    adjVal(height * BP[loop].b1y, border, height),    adjVal(width * BP[loop].b2x, border, width),      adjVal(height * BP[loop].b2y, border, height),    adjVal(width * BP[loop+1].spx, border, width),  adjVal(height * BP[loop+1].spy, border, height));
	}
	// -v- Constructions
	ctx.lineTo(adjVal(width * c2.curX, border, width),      adjVal(height * c2.curY, border, height));
	ctx.lineTo(adjVal(width * v1.curX, border, width),      adjVal(height * v1.curY, border, height));
	ctx.lineTo(adjVal(width * c1.curX, border, width),      adjVal(height * c1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing complement (V nested)
	if (same_X(c1, c2, border, width)) {
		ctx.moveTo(adjVal(width * c1.curX, border, width),  adjVal(height * c1.curY, border, height));
		ctx.lineTo(adjVal(width * v1.curX, border, width),  adjVal(height * v1.curY, border, height));
	}
	ctx.moveTo(adjVal(0, border, width),                    adjVal(0, border, height)); // Path End.
}

function drawFigureMemoboxBalloon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var h1 = getCoordValue(aryCoordset, "h1", "0", "85", width, height);        //Height point : "H1, 0,85, 0,0, 0,100"
	var v1 = getCoordValue(aryCoordset, "v1", "25", "100", width, height);      //vertex : "V1, 25,100, 0,100, 100,100"

	// ooO Constructions
	var dx = width * (0.5 - v1.curX); if (dx == 0) dx = 1;
	var dy = height * ((h1.curY / 2) - v1.curY);
	var slope = dy / dx;
	var xInterval = (dx + (height * (h1.curY / 2) / slope)) / 10;

	var multiple = 1;
	var radiius = Math.abs(slope * xInterval * multiple);
	var cx = (width * v1.curX) + (xInterval * multiple);
	var cy = height - (radiius * multiple);
	ctx.arc(adjVal(cx, border, width), adjVal(cy, border, height), radiius, 0, Math.PI * 2, false);
	pathCloseAndContinue(ctx, fw, bw);

	multiple = 2;
	radiius = Math.abs(slope * xInterval * multiple);
	cx += xInterval * multiple * 2;
	cy = height - (radiius * multiple);
	ctx.arc(adjVal(cx, border, width), adjVal(cy, border, height), radiius, 0, Math.PI * 2, false);
	pathCloseAndContinue(ctx, fw, bw);

	multiple = 3;
	radiius = Math.abs(slope * xInterval * multiple);
	cx += xInterval * multiple * 2;
	cy = height - (radiius * multiple);
	ctx.arc(adjVal(cx, border, width), adjVal(cy, border, height), radiius, 0, Math.PI * 2, false);
	pathCloseAndContinue(ctx, fw, bw);

	// () Constructions
	var circular = 0.225;
	ctx.moveTo(adjVal(width / 2, border, width),                        adjVal(0, border, height));
	ctx.bezierCurveTo(adjVal(width * circular, border, width),          adjVal(0, border, height),                                    adjVal(0, border, width),                       adjVal(height * h1.curY * circular, border, height),          adjVal(0, border, width),           adjVal(height * h1.curY / 2, border, height));
	ctx.bezierCurveTo(adjVal(0, border, width),                         adjVal(height * h1.curY * (1 - circular), border, height),    adjVal(width * circular, border, width),        adjVal(height * h1.curY, border, height),                     adjVal(width / 2, border, width),   adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(width * (1 - circular), border, width),    adjVal(height * h1.curY, border, height),                     adjVal(width, border, width),                   adjVal(height * h1.curY * (1 - circular), border, height),    adjVal(width, border, width),       adjVal(height * h1.curY / 2, border, height));
	ctx.bezierCurveTo(adjVal(width, border, width),                     adjVal(height * h1.curY * circular, border, height),          adjVal(width * (1 - circular), border, width),  adjVal(0, border, height),                                    adjVal(width / 2, border, width),   adjVal(0, border, height));
}

function drawFigureMemoboxAdballoon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var h1 = getCoordValue(aryCoordset, "h1", "0", "85", width, height);        //Height point : "H1, 0,85, 0,0, 0,100"
	var v1 = getCoordValue(aryCoordset, "v1", "25", "100", width, height);      //vertex : "V1, 25,100, 0,100, 100,100"

	// ooO Constructions
	var dx = width * (0.5 - v1.curX); if (dx == 0) dx = 1;
	var dy = height * ((h1.curY / 2) - v1.curY);
	var slope = dy / dx;
	var xInterval = (dx + (height * (h1.curY / 2) / slope)) / 10;

	var multiple = 1;
	var radiius = Math.abs(slope * xInterval * multiple);
	var cx = (width * v1.curX) + (xInterval * multiple);
	var cy = height - (radiius * multiple);
	ctx.arc(adjVal(cx, border, width), adjVal(cy, border, height), radiius, 0, Math.PI * 2, false);
	pathCloseAndContinue(ctx, fw, bw);

	multiple = 2;
	radiius = Math.abs(slope * xInterval * multiple);
	cx += xInterval * multiple * 2;
	cy = height - (radiius * multiple);
	ctx.arc(adjVal(cx, border, width), adjVal(cy, border, height), radiius, 0, Math.PI * 2, false);
	pathCloseAndContinue(ctx, fw, bw);

	multiple = 3;
	radiius = Math.abs(slope * xInterval * multiple);
	cx += xInterval * multiple * 2;
	cy = height - (radiius * multiple);
	ctx.arc(adjVal(cx, border, width), adjVal(cy, border, height), radiius, 0, Math.PI * 2, false);
	pathCloseAndContinue(ctx, fw, bw);

	// {} Constructions
	var BP = [];
	BP[0] = {};     BP[0].spx = 0.50;       BP[0].spy = h1.curY * 1.00;     
	BP[1] = {};     BP[1].spx = 0.38;       BP[1].spy = h1.curY * 0.91;      
	BP[2] = {};     BP[2].spx = 0.14;       BP[2].spy = h1.curY * 0.82;      
	BP[3] = {};     BP[3].spx = 0.05;       BP[3].spy = h1.curY * 0.65;      
	BP[4] = {};     BP[4].spx = 0.00;       BP[4].spy = h1.curY * 0.50;      
	BP[5] = {};     BP[5].spx = 0.09;       BP[5].spy = h1.curY * 0.34;       
	BP[6] = {};     BP[6].spx = 0.22;       BP[6].spy = h1.curY * 0.15;       
	BP[7] = {};     BP[7].spx = 0.41;       BP[7].spy = h1.curY * 0.08;      
	BP[8] = {};     BP[8].spx = 0.50;       BP[8].spy = h1.curY * 0.00;      
	BP[9] = {};     BP[9].spx = 0.58;       BP[9].spy = h1.curY * 0.06;      
	BP[10] = {};    BP[10].spx = 0.78;      BP[10].spy = h1.curY * 0.15;     
	BP[11] = {};    BP[11].spx = 0.95;      BP[11].spy = h1.curY * 0.37;     
	BP[12] = {};    BP[12].spx = 1.00;      BP[12].spy = h1.curY * 0.50;     
	BP[13] = {};    BP[13].spx = 0.87;      BP[13].spy = h1.curY * 0.70;     
	BP[14] = {};    BP[14].spx = 0.66;      BP[14].spy = h1.curY * 0.86;     

	BP[0].b1x = BP[0].spx + ((BP[1].spx - BP[0].spx) * 0.5);        BP[0].b1y = BP[0].spy;                                          BP[0].b2x = BP[0].spx + ((BP[1].spx - BP[0].spx) * 0.95);       BP[0].b2y = BP[0].spy + ((BP[1].spy - BP[0].spy) * 0.5);
	BP[1].b1x = BP[1].spx + ((BP[2].spx - BP[1].spx) * 0.25);       BP[1].b1y = BP[1].spy - ((BP[2].spy - BP[1].spy) * 0.33);       BP[1].b2x = BP[2].spx;                                          BP[1].b2y = BP[1].b1y;
	BP[2].b1x = BP[2].spx + ((BP[3].spx - BP[2].spx) * 0.5);        BP[2].b1y = BP[2].spy;                                          BP[2].b2x = BP[3].spx;                                          BP[2].b2y = BP[2].spy + ((BP[3].spy - BP[2].spy) * 0.5);
	BP[3].b1x = BP[3].spx + ((BP[4].spx - BP[3].spx) * 0.5);        BP[3].b1y = BP[3].spy;                                          BP[3].b2x = BP[4].spx;                                          BP[3].b2y = BP[3].spy + ((BP[4].spy - BP[3].spy) * 0.5);
	BP[4].b1x = BP[4].spx;                                          BP[4].b1y = BP[4].spy + ((BP[5].spy - BP[4].spy) * 0.5);        BP[4].b2x = BP[4].spx + ((BP[5].spx - BP[4].spx) * 0.5);        BP[4].b2y = BP[5].spy;
	BP[5].b1x = BP[5].spx - ((BP[6].spx - BP[5].spx) * 0.2);        BP[5].b1y = BP[5].spy + ((BP[6].spy - BP[5].spy) * 0.5);        BP[5].b2x = BP[5].spx + ((BP[6].spx - BP[5].spx) * 0.5);        BP[5].b2y = BP[6].spy;
	BP[6].b1x = BP[6].spx + ((BP[7].spx - BP[6].spx) * 0.25);       BP[6].b1y = BP[6].spy + ((BP[7].spy - BP[6].spy) * 2.0);        BP[6].b2x = BP[6].spx + ((BP[7].spx - BP[6].spx) * 0.75);       BP[6].b2y = BP[6].b1y;
	BP[7].b1x = BP[7].spx + ((BP[8].spx - BP[7].spx) * 0.25);       BP[7].b1y = BP[7].spy + ((BP[8].spy - BP[7].spy) * 0.5);        BP[7].b2x = BP[7].spx + ((BP[8].spx - BP[7].spx) * 0.5);        BP[7].b2y = BP[8].spy;
	BP[8].b1x = BP[8].spx + ((BP[9].spx - BP[8].spx) * 0.5);        BP[8].b1y = BP[8].spy;                                          BP[8].b2x = BP[8].spx + ((BP[9].spx - BP[8].spx) * 0.75);       BP[8].b2y = BP[8].spy + ((BP[9].spy - BP[8].spy) * 0.5);
	BP[9].b1x = BP[9].spx + ((BP[10].spx - BP[9].spx) * 0.25);      BP[9].b1y = BP[9].spy - ((BP[10].spy - BP[9].spy) * 0.5);       BP[9].b2x = BP[9].spx + ((BP[10].spx - BP[9].spx) * 0.75);      BP[9].b2y = BP[9].b1y;
	BP[10].b1x = BP[10].spx + ((BP[11].spx - BP[10].spx) * 0.5);    BP[10].b1y = BP[10].spy;                                        BP[10].b2x = BP[11].spx;                                        BP[10].b2y = BP[10].spy + ((BP[11].spy - BP[10].spy) * 0.5);
	BP[11].b1x = BP[11].spx + ((BP[12].spx - BP[11].spx) * 0.75);   BP[11].b1y = BP[11].spy + ((BP[12].spy - BP[11].spy) * 0.25);   BP[11].b2x = BP[12].spx;                                        BP[11].b2y = BP[11].spy + ((BP[12].spy - BP[11].spy) * 0.5);
	BP[12].b1x = BP[12].spx;                                        BP[12].b1y = BP[12].spy + ((BP[13].spy - BP[12].spy) * 0.5);    BP[12].b2x = BP[12].spx + ((BP[13].spx - BP[12].spx) * 0.5);    BP[12].b2y = BP[13].spy;
	BP[13].b1x = BP[13].spx + ((BP[14].spx - BP[13].spx) * 0.25);   BP[13].b1y = BP[13].spy + ((BP[14].spy - BP[13].spy) * 1.5);    BP[13].b2x = BP[13].spx + ((BP[14].spx - BP[13].spx) * 0.75);   BP[13].b2y = BP[13].b1y;
	BP[14].b1x = BP[14].spx;                                        BP[14].b1y = BP[14].spy + ((BP[0].spy - BP[14].spy) * 0.5);     BP[14].b2x = BP[14].spx + ((BP[0].spx - BP[14].spx) * 0.5);     BP[14].b2y = BP[0].spy;

	for (loop = 0; loop <= 14; loop++) {
		if (loop == 0)
			ctx.moveTo(adjVal(width * BP[loop].spx, border, width),           adjVal(height * BP[loop].spy, border, height));
		if (loop == 14)
			ctx.bezierCurveTo(adjVal(width * BP[loop].b1x, border, width),    adjVal(height * BP[loop].b1y, border, height),    adjVal(width * BP[loop].b2x, border, width),      adjVal(height * BP[loop].b2y, border, height),    adjVal(width * BP[0].spx, border, width),         adjVal(height * BP[0].spy, border, height));
		else
			ctx.bezierCurveTo(adjVal(width * BP[loop].b1x, border, width),    adjVal(height * BP[loop].b1y, border, height),    adjVal(width * BP[loop].b2x, border, width),      adjVal(height * BP[loop].b2y, border, height),    adjVal(width * BP[loop+1].spx, border, width),    adjVal(height * BP[loop+1].spy, border, height));
	}
}

function drawFigureRectRibbonLeft(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var c1 = getCoordValue(aryCoordset, "c1", "25", "50", ex, ey);  // Crack point : "C1, 25,50, 0,50, 100,50"

	ctx.moveTo(adjVal(ex, border, ex), adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx, border, ex),                              adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx + (width * c1.curX), border, ex),          adjVal(sy + (height * c1.curY), border, ey));
	ctx.lineTo(adjVal(sx, border, ex), adjVal(ey, border, ey));
	ctx.lineTo(adjVal(ex, border, ex), adjVal(ey, border, ey));
	pathCloseAndContinue(ctx, fw, bw);
}

function drawFigureRectRibbonRight(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var c1 = getCoordValue(aryCoordset, "c1", "75", "50", ex, ey);  // Crack point : "C1, 75,50, 0,50, 100,50"

	ctx.moveTo(adjVal(sx, border, ex),                              adjVal(sy, border, ey));
	ctx.lineTo(adjVal(ex, border, ex), adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx + (width * c1.curX), border, ex),          adjVal(sy + (height * c1.curY), border, ey));
	ctx.lineTo(adjVal(ex, border, ex), adjVal(ey, border, ey));
	ctx.lineTo(adjVal(sx, border, ex), adjVal(ey, border, ey));
	pathCloseAndContinue(ctx, fw, bw);
}

function drawFigureRoundRibbonLeft(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var c1 = getCoordValue(aryCoordset, "c1", "25", "50", ex, ey);  // Crack point : "C1, 25,50, 0,50, 100,50"
	var f1 = getCoordValue(aryCoordset, "f1", "90", "0", ex, ey);   //Inflection point : "F1, 90,0, 75@MIN(100_W:100_H),0, 100,0"
	var radius = Math.min(Math.min(width / 2, height / 2), width * (1 - f1.curX));

	ctx.moveTo(adjVal(sx + (width / 2), border, ex),        adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx, border, ex),                      adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx + (width * c1.curX), border, ex),  adjVal(sy + (height * c1.curY), border, ey));
	ctx.lineTo(adjVal(sx, border, ex),                      adjVal(ey, border, ey));
	ctx.lineTo(adjVal(sx + (width / 2), border, ex),        adjVal(ey, border, ey));
	ctx.arcTo(adjVal(ex, border, ex),                       adjVal(ey, border, ey),     adjVal(ex, border, ex),                 adjVal(sy + (height / 2), border, ey),  radius);
	ctx.arcTo(adjVal(ex, border, ex),                       adjVal(sy, border, ey),     adjVal(sx + (width / 2), border, ex),   adjVal(sy, border, ey),                 radius);
	pathCloseAndContinue(ctx, fw, bw);
}

function drawFigureRoundRibbonRight(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var c1 = getCoordValue(aryCoordset, "c1", "75", "50", ex, ey);  // Crack point : "C1, 75,50, 0,50, 100,50"
	var f1 = getCoordValue(aryCoordset, "f1", "10", "0", ex, ey);   //Inflection point : "F1, 10,0, 0,0, 25@MIN(100_W:100_H),0"
	var radius = Math.min(Math.min(width / 2, height / 2), width * f1.curX);

	ctx.moveTo(adjVal(sx + (width / 2), border, ex),        adjVal(sy, border, ey));
	ctx.lineTo(adjVal(ex, border, ex),                      adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx + (width * c1.curX), border, ex),  adjVal(sy + (height * c1.curY), border, ey));
	ctx.lineTo(adjVal(ex, border, ex),                      adjVal(ey, border, ey));
	ctx.lineTo(adjVal(sx + (width / 2), border, ex),        adjVal(ey, border, ey));
	ctx.arcTo(adjVal(sx, border, ex),                       adjVal(ey, border, ey),     adjVal(sx, border, ex),                 adjVal(sy + (height / 2), border, ey),  radius);
	ctx.arcTo(adjVal(sx, border, ex),                       adjVal(sy, border, ey),     adjVal(sx + (width / 2), border, ex),   adjVal(sy, border, ey),                 radius);
	pathCloseAndContinue(ctx, fw, bw);
}

function drawFigureRibbonRect(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var d1 = getCoordValue(aryCoordset, "d1", "25", "0", width, height);        //Width Point : "D1, 25,0, 12.5,0, 37.5,0"
	var h1 = getCoordValue(aryCoordset, "h1", "50", "80", width, height);       //Height point : "H1, 50,80, 50,66, 50,100"

	var adjBorder = parseInt(border / 3) + 1;

	// Drawing ribbon left
	var objWidth = width * (d1.curX + 0.125);
	var objC1X = width * 0.125 / objWidth * 100;
	var strCoordset = "C1, " + objC1X + ",50, 0,50, 100,50";
	var objCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
	ctx.strokeStyle = ctx.fillStyle = (apply == true) ? fillColor : fillColor.replace(",1)", ",0.5)");
	setGradient(ctx, null, fillColor, apply);
	drawFigureRectRibbonLeft(ctx, 0, height * (1 - h1.curY), width * (d1.curX + 0.125), height, objCoordset, border, dash, borderColor, fillColor, fw, bw, apply)
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing the right ribbon
	strCoordset = "C1, " + (100 - objC1X) + ",50, 0,50, 100,50";
	objCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
	drawFigureRectRibbonRight(ctx, width * (1 - (d1.curX + 0.125)), height * (1 - h1.curY), width, height, objCoordset, border, dash, borderColor, fillColor, fw, bw, apply)
	pathCloseAndContinue(ctx, fw, bw);

	// Construct the left the other side
	ctx.strokeStyle = ctx.fillStyle = getDrawColor(fillColor, 'dark');
	//Except for the gradient applies.
	//setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.moveTo(adjVal(width * (d1.curX + 0.125), border, width),            adjVal(height * h1.curY, border, height));
	ctx.lineTo(adjVal(width * d1.curX + border, border, width),             adjVal(height * h1.curY, border, height));
	ctx.lineTo(adjVal(width * (d1.curX + 0.125), border, width),            adjVal(height, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Construct the other side right
	ctx.moveTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),      adjVal(height * h1.curY, border, height));
	ctx.lineTo(adjVal(width * (1 - d1.curX) - border, border, width),       adjVal(height * h1.curY, border, height));
	ctx.lineTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),      adjVal(height, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing front
	ctx.strokeStyle = ctx.fillStyle = (apply == true) ? fillColor : fillColor.replace(",1)", ",0.5)");
	setGradient(ctx, null, fillColor, apply);
	drawFigureRect(ctx, width * d1.curX, height * d1.curY, width * (1 - d1.curX) + adjBorder, height * h1.curY + adjBorder, null, border, dash, borderColor, fillColor, fw, bw, apply);
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// Drawing the left edge Ribbon
		ctx.moveTo(adjVal(width * d1.curX, border, width),                  adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(0, border, width),                                adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(width * 0.125, border, width),                    adjVal(height * (1 - h1.curY + (h1.curY / 2)), border, height));
		ctx.lineTo(adjVal(0, border, width),                                adjVal(height, border, height));
		ctx.lineTo(adjVal(width * (d1.curX + 0.125), border, width),        adjVal(height, border, height));
		ctx.lineTo(adjVal(width * (d1.curX + 0.125), border, width),        adjVal(height * h1.curY, border, height));
		ctx.lineTo(adjVal(width / 2, border, width),                        adjVal(height * h1.curY, border, height));
		pathStrokeAndContinue(ctx, fw, bw);
		// Construct the other side left border
		ctx.moveTo(adjVal(width * (d1.curX + 0.125), border, width),        adjVal(height, border, height));
		ctx.lineTo(adjVal(width * d1.curX, border, width),                  adjVal(height * h1.curY + adjBorder, border, height));
		ctx.lineTo(adjVal(width * d1.curX, border, width),                  adjVal(height * (1 - h1.curY), border, height));
		pathStrokeAndContinue(ctx, fw, bw);
		// Drawing the right edge Ribbons
		ctx.moveTo(adjVal(width * (1 - d1.curX), border, width),            adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(width, border, width),                            adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(width * (1 - 0.125), border, width),              adjVal(height * (1 - h1.curY + (h1.curY / 2)), border, height));
		ctx.lineTo(adjVal(width, border, width),                            adjVal(height, border, height));
		ctx.lineTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),  adjVal(height, border, height));
		ctx.lineTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),  adjVal(height * h1.curY, border, height));
		ctx.lineTo(adjVal(width / 2, border, width),                        adjVal(height * h1.curY, border, height));
		pathStrokeAndContinue(ctx, fw, bw);
		// Construct the other side right border
		ctx.moveTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),  adjVal(height, border, height));
		ctx.lineTo(adjVal(width * (1 - d1.curX), border, width),            adjVal(height * h1.curY + adjBorder, border, height));
		ctx.lineTo(adjVal(width * (1 - d1.curX), border, width),            adjVal(height * (1 - h1.curY), border, height));
		pathStrokeAndContinue(ctx, fw, bw);
		// Drawing the front edge
		drawFigureRect(ctx, width * d1.curX, height * d1.curY, width * (1 - d1.curX) + adjBorder, height * h1.curY + adjBorder, null, border, dash, borderColor, fillColor, fw, bw, apply);
	}
}

function drawFigureRibbonRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var d1 = getCoordValue(aryCoordset, "d1", "25", "0", width, height);        //Width Point : "D1, 25,0, 12.5,0, 37.5,0"
	var h1 = getCoordValue(aryCoordset, "h1", "50", "80", width, height);       //Height point : "H1, 50,80, 50,66, 50,100"

	var adjBorder = parseInt(border / 3) + 1;
	var radius = Math.min(Math.min(width * (1 - (d1.curX * 2)) / 4, height * h1.curY / 4), Math.min(width * 0.125 / 3, height * (1 - h1.curY) / 4));

	// Drawing ribbon left
	var objWidth = width * (d1.curX + 0.125);
	var objC1X = width * 0.125 / objWidth * 100;
	var strCoordset = "C1, " + objC1X + ",50, 0,50, 100,50; F1, " + (100 - (radius / objWidth * 100)) + ",0, 75@MIN(100_W:100_H),0, 100,0;";
	var objCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
	ctx.strokeStyle = ctx.fillStyle = (apply == true) ? fillColor : fillColor.replace(",1)", ",0.5)");
	setGradient(ctx, null, fillColor, apply);
	drawFigureRoundRibbonLeft(ctx, 0, height * (1 - h1.curY), width * (d1.curX + 0.125), height, objCoordset, border, dash, borderColor, fillColor, fw, bw, apply)
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing the right ribbon
	strCoordset = "C1, " + (100 - objC1X) + ",50, 0,50, 100,50; F1, " + (radius / objWidth * 100) + ",0, 0,0, 25@MIN(100_W:100_H),0;";
	objCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
	drawFigureRoundRibbonRight(ctx, width * (1 - (d1.curX + 0.125)), height * (1 - h1.curY), width, height, objCoordset, border, dash, borderColor, fillColor, fw, bw, apply)
	pathCloseAndContinue(ctx, fw, bw);

	// Construct the left the other side
	ctx.strokeStyle = ctx.fillStyle = getDrawColor(fillColor, 'dark');
	//Except for the gradient applies.
	//setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.moveTo(adjVal(width * (d1.curX + 0.125), border, width),            adjVal(height * h1.curY, border, height));
	ctx.arcTo(adjVal(width * d1.curX, border, width),                       adjVal(height * h1.curY, border, height),                           adjVal(width * d1.curX, border, width),                         adjVal(height * (h1.curY + ((1 - h1.curY) / 4)), border, height),   radius);
	ctx.arcTo(adjVal(width * d1.curX, border, width),                       adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   adjVal(width * (d1.curX + (0.125 / 2)), border, width),         adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   radius);
	ctx.arcTo(adjVal(width * (d1.curX + 0.125), border, width),             adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   adjVal(width * (d1.curX + 0.125), border, width),               adjVal(height * (1 - ((1 - h1.curY) / 4)), border, height),         radius);
	pathCloseAndContinue(ctx, fw, bw);

	// Construct the other side right
	ctx.moveTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),      adjVal(height * h1.curY, border, height));
	ctx.arcTo(adjVal(width * (1 - d1.curX), border, width),                 adjVal(height * h1.curY, border, height),                           adjVal(width * (1 - d1.curX), border, width),                   adjVal(height * (h1.curY + ((1 - h1.curY) / 4)), border, height),   radius);
	ctx.arcTo(adjVal(width * (1 - d1.curX), border, width),                 adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   adjVal(width * (1 - (d1.curX + (0.125 / 2))), border, width),   adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   radius);
	ctx.arcTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),       adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   adjVal(width * (1 - (d1.curX + 0.125)), border, width),         adjVal(height * (1 - ((1 - h1.curY) / 4)), border, height),         radius);
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing front
	ctx.strokeStyle = ctx.fillStyle = (apply == true) ? fillColor : fillColor.replace(",1)", ",0.5)");
	setGradient(ctx, null, fillColor, apply);
	strCoordset = "F1, " + (radius / (width * (1 - (d1.curX * 2))) * 100) + ",0, 0,0, 25@MIN(100_W:100_H),0;";
	objCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
	drawFigureRectDoubleRoundEx(ctx, width * d1.curX, height * d1.curY, width * (1 - d1.curX) + adjBorder, height * h1.curY + adjBorder + radius, objCoordset, border, dash, borderColor, fillColor, fw, bw, apply);
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// Drawing the left edge Ribbon
		ctx.moveTo(adjVal(width * d1.curX, border, width),                  adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(0, border, width),                                adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(width * 0.125, border, width),                    adjVal(height * (1 - h1.curY + (h1.curY / 2)), border, height));
		ctx.lineTo(adjVal(0, border, width),                                adjVal(height, border, height));
		ctx.lineTo(adjVal(width * (d1.curX + (0.125 / 2)), border, width),  adjVal(height, border, height));
		ctx.arcTo(adjVal(width * (d1.curX + 0.125), border, width),         adjVal(height, border, height),                                     adjVal(width * (d1.curX + 0.125), border, width),               adjVal(height * (1 - ((1 - h1.curY) / 4)), border, height),         radius);
		ctx.lineTo(adjVal(width * (d1.curX + 0.125), border, width),        adjVal(height * h1.curY, border, height));
		ctx.lineTo(adjVal(width / 2, border, width),                        adjVal(height * h1.curY, border, height));
		pathStrokeAndContinue(ctx, fw, bw);
		// Construct the other side left border
		ctx.moveTo(adjVal(width * (d1.curX + 0.125), border, width),        adjVal(height * h1.curY, border, height));
		ctx.arcTo(adjVal(width * d1.curX, border, width),                   adjVal(height * h1.curY, border, height),                           adjVal(width * d1.curX, border, width),                         adjVal(height * (h1.curY + ((1 - h1.curY) / 4)), border, height),   radius);
		ctx.arcTo(adjVal(width * d1.curX, border, width),                   adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   adjVal(width * (d1.curX + (0.125 / 2)), border, width),         adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   radius);
		ctx.arcTo(adjVal(width * (d1.curX + 0.125), border, width),         adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   adjVal(width * (d1.curX + 0.125), border, width),               adjVal(height * (1 - ((1 - h1.curY) / 4)), border, height),         radius);
		pathStrokeAndContinue(ctx, fw, bw);
		// Drawing the right edge Ribbons
		ctx.moveTo(adjVal(width * (1 - d1.curX), border, width),            adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(width, border, width),                            adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(width * (1 - 0.125), border, width),              adjVal(height * (1 - h1.curY + (h1.curY / 2)), border, height));
		ctx.lineTo(adjVal(width, border, width),                            adjVal(height, border, height));
		ctx.lineTo(adjVal(width * (1 - (d1.curX + (0.125 / 2))), border, width),  adjVal(height, border, height));
		ctx.arcTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),   adjVal(height, border, height),                                     adjVal(width * (1 - (d1.curX + 0.125)), border, width),         adjVal(height * (1 - ((1 - h1.curY) / 4)), border, height),         radius);
		ctx.lineTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),  adjVal(height * h1.curY, border, height));
		ctx.lineTo(adjVal(width / 2, border, width),                        adjVal(height * h1.curY, border, height));
		pathStrokeAndContinue(ctx, fw, bw);
		// Construct the other side right border
		ctx.moveTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),  adjVal(height * h1.curY, border, height));
		ctx.arcTo(adjVal(width * (1 - d1.curX), border, width),             adjVal(height * h1.curY, border, height),                           adjVal(width * (1 - d1.curX), border, width),                   adjVal(height * (h1.curY + ((1 - h1.curY) / 4)), border, height),   radius);
		ctx.arcTo(adjVal(width * (1 - d1.curX), border, width),             adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   adjVal(width * (1 - (d1.curX + (0.125 / 2))), border, width),   adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   radius);
		ctx.arcTo(adjVal(width * (1 - (d1.curX + 0.125)), border, width),   adjVal(height * (h1.curY + ((1 - h1.curY) / 2)), border, height),   adjVal(width * (1 - (d1.curX + 0.125)), border, width),         adjVal(height * (1 - ((1 - h1.curY) / 4)), border, height),         radius);
		pathStrokeAndContinue(ctx, fw, bw);
		// Drawing the front edge
		strCoordset = "F1, " + (radius / (width * (1 - (d1.curX * 2))) * 100) + ",0, 0,0, 25@MIN(100_W:100_H),0;";
		objCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
		drawFigureRectDoubleRoundEx(ctx, width * d1.curX, height * d1.curY, width * (1 - d1.curX) + adjBorder, height * h1.curY + adjBorder + radius, objCoordset, border, dash, borderColor, fillColor, fw, bw, apply);
	}
}

function drawFigureRollpaper1(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var z1 = getCoordValue(aryCoordset, "z1", "5", "100", ex, ey);              //Size point : "Z1, 5,100, 0,100, 25@MIN(100_W:100_H),100"

	var radius = Math.min(Math.min(width / 2, height / 2), width * z1.curX);
	var smallRadius = radius / 2;

	// Drawing paper
	ctx.moveTo(adjVal(sx + (width / 2), border, ex),    adjVal(sy, border, ey));
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(sy, border, ey),                     adjVal(sx, border, ex),                 adjVal(sy + (height / 2), border, ey),  radius);
	ctx.lineTo(adjVal(sx, border, ex),                  adjVal(ey - radius, border, ey));
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(ey - (radius * 2), border, ey),      adjVal(sx + (width / 2), border, ex),   adjVal(ey - (radius * 2), border, ey),  radius);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(ey - (radius * 2), border, ey),      adjVal(ex, border, ex),                 adjVal(ey - radius, border, ey),        radius);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(sy, border, ey),                     adjVal(sx + (width / 2), border, ex),   adjVal(sy, border, ey),                 radius);
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing roll left
	ctx.fillStyle = getDrawColor(fillColor, 'dark');
	//Except for the gradient applies.
	//setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.moveTo(adjVal(sx + radius, border, ex),         adjVal(ey - (radius * 2), border, ey));
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(ey - (radius * 2), border, ey),      adjVal(sx, border, ex),                 adjVal(ey - radius, border, ey),    radius);
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(ey, border, ey),                     adjVal(sx + radius, border, ex),        adjVal(ey, border, ey),             radius);
	ctx.arcTo(adjVal(sx + (radius * 2), border, ex),    adjVal(ey, border, ey),                     adjVal(sx + (radius * 2), border, ex),  adjVal(ey - radius, border, ey),    radius);
	ctx.lineTo(adjVal(sx + (radius * 2), border, ex),   adjVal(ey - (radius * 2), border, ey));
	pathCloseAndContinue(ctx, fw, bw);
	setGradient(ctx, null, fillColor, apply);
	ctx.moveTo(adjVal(sx + radius, border, ex),         adjVal(ey - (radius * 2), border, ey));
	ctx.lineTo(adjVal(sx + radius, border, ex),         adjVal(ey - radius, border, ey));
	ctx.arcTo(adjVal(sx + radius, border, ex),          adjVal(ey - (radius + smallRadius), border, ey),    adjVal(sx + (radius + smallRadius), border, ex),    adjVal(ey - (radius + smallRadius), border, ey),    smallRadius);
	ctx.arcTo(adjVal(sx + (radius * 2), border, ex),    adjVal(ey - (radius + smallRadius), border, ey),    adjVal(sx + (radius * 2), border, ex),              adjVal(ey - radius, border, ey),                    smallRadius);
	ctx.lineTo(adjVal(sx + (radius * 2), border, ex),   adjVal(ey - (radius * 2), border, ey));
	pathCloseAndContinue(ctx, fw, bw);

	// Roll Drawing Right
	ctx.fillStyle = getDrawColor(fillColor, 'dark');
	//Except for the gradient applies.
	//setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.moveTo(adjVal(ex - radius, border, ex),         adjVal(ey - (radius * 2), border, ey));
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(ey - (radius * 2), border, ey),      adjVal(ex, border, ex),                 adjVal(ey - radius, border, ey),    radius);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(ey, border, ey),                     adjVal(ex - radius, border, ex),        adjVal(ey, border, ey),             radius);
	ctx.arcTo(adjVal(ex - (radius * 2), border, ex),    adjVal(ey, border, ey),                     adjVal(ex - (radius * 2), border, ex),  adjVal(ey - radius, border, ey),    radius);
	ctx.lineTo(adjVal(ex - (radius * 2), border, ex),   adjVal(ey - (radius * 2), border, ey));
	pathCloseAndContinue(ctx, fw, bw);
	setGradient(ctx, null, fillColor, apply);
	ctx.moveTo(adjVal(ex - radius, border, ex),         adjVal(ey - (radius * 2), border, ey));
	ctx.lineTo(adjVal(ex - radius, border, ex),         adjVal(ey - radius, border, ey));
	ctx.arcTo(adjVal(ex - radius, border, ex),          adjVal(ey - (radius + smallRadius), border, ey),    adjVal(ex - (radius + smallRadius), border, ex),    adjVal(ey - (radius + smallRadius), border, ey),    smallRadius);
	ctx.arcTo(adjVal(ex - (radius * 2), border, ex),    adjVal(ey - (radius + smallRadius), border, ey),    adjVal(ex - (radius * 2), border, ex),              adjVal(ey - radius, border, ey),                    smallRadius);
	ctx.lineTo(adjVal(ex - (radius * 2), border, ex),   adjVal(ey - (radius * 2), border, ey));
	pathCloseAndContinue(ctx, fw, bw);
}

function drawFigureRollpaper2(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var z1 = getCoordValue(aryCoordset, "z1", "5", "0", width, height);         //Size point : "Z1, 5,0, 0,0, 25@MIN(100_W:100_H),0"

	var radius = Math.min(Math.min(width / 2, height / 2), width * z1.curX);
	var smallRadius = radius / 2;

	// Drawing paper
	ctx.moveTo(adjVal(sx + (radius * 2), border, ex),   adjVal(sy + (radius * 2), border, ey));
	ctx.lineTo(adjVal(sx + (radius * 2), border, ex),   adjVal(ey - radius, border, ey));
	ctx.arcTo(adjVal(sx + (radius * 2), border, ex),    adjVal(ey - (radius * 2), border, ey),      adjVal(sx + radius, border, ex),        adjVal(ey - (radius * 2), border, ey),  radius);
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(ey - (radius * 2), border, ey),      adjVal(sx, border, ex),                 adjVal(ey - radius, border, ey),        radius);
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(ey, border, ey),                     adjVal(sx + radius, border, ex),        adjVal(ey, border, ey),                 radius);
	ctx.lineTo(adjVal(ex - radius, border, ex),         adjVal(ey, border, ey));
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(ey, border, ey),                     adjVal(ex, border, ex),                 adjVal(ey - radius, border, ey),        radius);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(ey - (radius * 2), border, ey),      adjVal(ex - radius, border, ex),        adjVal(ey - (radius * 2), border, ey),  radius);
	ctx.arcTo(adjVal(ex - (radius * 2), border, ex),    adjVal(ey - (radius * 2), border, ey),      adjVal(ex - (radius * 2), border, ex),  adjVal(ey - radius, border, ey),        radius);
	ctx.lineTo(adjVal(ex - (radius * 2), border, ex),   adjVal(sy + (radius * 2), border, ey));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing roll left
	setGradient(ctx, null, fillColor, apply);
	ctx.moveTo(adjVal(sx + (radius * 2), border, ex),   adjVal(sy + (radius * 2), border, ey));
	ctx.lineTo(adjVal(sx + (radius * 2), border, ex),   adjVal(sy + radius, border, ey));
	ctx.arcTo(adjVal(sx + (radius * 2), border, ex),    adjVal(sy, border, ey),                     adjVal(sx + radius, border, ex),        adjVal(sy, border, ey),                 radius);
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(sy, border, ey),                     adjVal(sx, border, ex),                 adjVal(sy + radius, border, ey),        radius);
	ctx.lineTo(adjVal(sx, border, ex),                  adjVal(ey - radius, border, ey));
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(ey - (radius * 2), border, ey),      adjVal(sx + radius, border, ex),        adjVal(ey - (radius * 2), border, ey),  radius);
	ctx.arcTo(adjVal(sx + (radius * 2), border, ex),    adjVal(ey - (radius * 2), border, ey),      adjVal(sx + (radius * 2), border, ex),  adjVal(ey - radius, border, ey),        radius);
	pathCloseAndContinue(ctx, fw, bw);
	ctx.fillStyle = getDrawColor(fillColor, 'dark');
	//Except for the gradient applies.
	//setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.moveTo(adjVal(sx + (radius * 2), border, ex),   adjVal(ey - radius, border, ey));
	ctx.arcTo(adjVal(sx + (radius * 2), border, ex),    adjVal(ey - smallRadius, border, ey),       adjVal(sx + (radius + smallRadius), border, ex),    adjVal(ey - smallRadius, border, ey),   smallRadius);
	ctx.arcTo(adjVal(sx + radius, border, ex),          adjVal(ey - smallRadius, border, ey),       adjVal(sx + radius, border, ex),                    adjVal(ey - radius, border, ey),        smallRadius);
	ctx.lineTo(adjVal(sx + radius, border, ex),         adjVal(ey - (radius * 2), border, ey));
	ctx.arcTo(adjVal(sx + (radius * 2), border, ex),    adjVal(ey - (radius * 2), border, ey),      adjVal(sx + (radius * 2), border, ex),  adjVal(ey - radius, border, ey),        radius);
	pathCloseAndContinue(ctx, fw, bw);

	// Roll Drawing Right
	setGradient(ctx, null, fillColor, apply);
	ctx.moveTo(adjVal(ex - (radius * 2), border, ex),   adjVal(sy + (radius * 2), border, ey));
	ctx.lineTo(adjVal(ex - (radius * 2), border, ex),   adjVal(sy + radius, border, ey));
	ctx.arcTo(adjVal(ex - (radius * 2), border, ex),    adjVal(sy, border, ey),                     adjVal(ex - radius, border, ex),        adjVal(sy, border, ey),                 radius);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(sy, border, ey),                     adjVal(ex, border, ex),                 adjVal(sy + radius, border, ey),        radius);
	ctx.lineTo(adjVal(ex, border, ex),                  adjVal(ey - radius, border, ey));
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(ey - (radius * 2), border, ey),      adjVal(ex - radius, border, ex),        adjVal(ey - (radius * 2), border, ey),  radius);
	ctx.arcTo(adjVal(ex - (radius * 2), border, ex),    adjVal(ey - (radius * 2), border, ey),      adjVal(ex - (radius * 2), border, ex),  adjVal(ey - radius, border, ey),        radius);
	pathCloseAndContinue(ctx, fw, bw);
	ctx.fillStyle = getDrawColor(fillColor, 'dark');
	//Except for the gradient applies.
	//setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.moveTo(adjVal(ex - (radius * 2), border, ex),   adjVal(ey - radius, border, ey));
	ctx.arcTo(adjVal(ex - (radius * 2), border, ex),    adjVal(ey - smallRadius, border, ey),       adjVal(ex - (radius + smallRadius), border, ex),    adjVal(ey - smallRadius, border, ey),   smallRadius);
	ctx.arcTo(adjVal(ex - radius, border, ex),          adjVal(ey - smallRadius, border, ey),       adjVal(ex - radius, border, ex),                    adjVal(ey - radius, border, ey),        smallRadius);
	ctx.lineTo(adjVal(ex - radius, border, ex),         adjVal(ey - (radius * 2), border, ey));
	ctx.arcTo(adjVal(ex - (radius * 2), border, ex),    adjVal(ey - (radius * 2), border, ey),      adjVal(ex - (radius * 2), border, ex),  adjVal(ey - radius, border, ey),        radius);
	pathCloseAndContinue(ctx, fw, bw);
}

function drawFigureBanner1(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "0", "10", ex, ey);               //Inflection point : "F1, 0,10, 0,0, 0,25"

	var unitWidth = width / 8;
	var unitHeight = height * f1.curY;

	ctx.moveTo(adjVal(sx, border, ex),                              adjVal(sy + unitHeight, border, ey));
	ctx.quadraticCurveTo(adjVal(sx + unitWidth, border, ex),        adjVal(sy, border, ey),                         adjVal(sx + (unitWidth * 2), border, ex),   adjVal(sy, border, ey));
	ctx.bezierCurveTo(adjVal(sx + (unitWidth * 3), border, ex),     adjVal(sy, border, ey),                         adjVal(sx + (unitWidth * 5), border, ex),   adjVal(sy + (unitHeight * 2), border, ey),      adjVal(sx + (unitWidth * 6), border, ex),   adjVal(sy + (unitHeight * 2), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 7), border, ex),  adjVal(sy + (unitHeight * 2), border, ey),      adjVal(ex, border, ex),                     adjVal(sy + unitHeight, border, ey));
	ctx.lineTo(adjVal(ex, border, ex),                              adjVal(ey - unitHeight, border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 7), border, ex),  adjVal(ey, border, ey),                         adjVal(sx + (unitWidth * 6), border, ex),   adjVal(ey, border, ey));
	ctx.bezierCurveTo(adjVal(sx + (unitWidth * 5), border, ex),     adjVal(ey, border, ey),                         adjVal(sx + (unitWidth * 3), border, ex),   adjVal(ey - (unitHeight * 2), border, ey),      adjVal(sx + (unitWidth * 2), border, ex),   adjVal(ey - (unitHeight * 2), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + unitWidth, border, ex),        adjVal(ey - (unitHeight * 2), border, ey),      adjVal(sx, border, ex),                     adjVal(ey - unitHeight, border, ey));
}

function drawFigureBanner2(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "0", "10", ex, ey);               //Inflection point : "F1, 0,10, 0,0, 0,25"

	var unitWidth = width / 16;
	var unitHeight = height * f1.curY;

	ctx.moveTo(adjVal(sx, border, ex),                              adjVal(sy + unitHeight, border, ey));
	ctx.quadraticCurveTo(adjVal(sx + unitWidth, border, ex),        adjVal(sy, border, ey),                     adjVal(sx + (unitWidth * 2), border, ex),   adjVal(sy, border, ey));
	ctx.bezierCurveTo(adjVal(sx + (unitWidth * 3), border, ex),     adjVal(sy, border, ey),                     adjVal(sx + (unitWidth * 5), border, ex),   adjVal(sy + (unitHeight * 2), border, ey),      adjVal(sx + (unitWidth * 6), border, ex),   adjVal(sy + (unitHeight * 2), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 7), border, ex),  adjVal(sy + (unitHeight * 2), border, ey),  adjVal(sx + (unitWidth * 8), border, ex),   adjVal(sy + unitHeight, border, ey));

	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 9), border, ex),  adjVal(sy, border, ey),                     adjVal(sx + (unitWidth * 10), border, ex),  adjVal(sy, border, ey));
	ctx.bezierCurveTo(adjVal(sx + (unitWidth * 11), border, ex),    adjVal(sy, border, ey),                     adjVal(sx + (unitWidth * 13), border, ex),  adjVal(sy + (unitHeight * 2), border, ey),      adjVal(sx + (unitWidth * 14), border, ex),  adjVal(sy + (unitHeight * 2), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 15), border, ex), adjVal(sy + (unitHeight * 2), border, ey),  adjVal(ex, border, ex),                     adjVal(sy + unitHeight, border, ey));

	ctx.lineTo(adjVal(ex, border, ex),                              adjVal(ey - unitHeight, border, ey));

	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 15), border, ex), adjVal(ey, border, ey),                     adjVal(sx + (unitWidth * 14), border, ex),  adjVal(ey, border, ey));
	ctx.bezierCurveTo(adjVal(sx + (unitWidth * 13), border, ex),    adjVal(ey, border, ey),                     adjVal(sx + (unitWidth * 11), border, ex),  adjVal(ey - (unitHeight * 2), border, ey),      adjVal(sx + (unitWidth * 10), border, ex),  adjVal(ey - (unitHeight * 2), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 9), border, ex),  adjVal(ey - (unitHeight * 2), border, ey),  adjVal(sx + (unitWidth * 8), border, ex),   adjVal(ey - unitHeight, border, ey));

	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 7), border, ex),  adjVal(ey, border, ey),                     adjVal(sx + (unitWidth * 6), border, ex),   adjVal(ey, border, ey));
	ctx.bezierCurveTo(adjVal(sx + (unitWidth * 5), border, ex),     adjVal(ey, border, ey),                     adjVal(sx + (unitWidth * 3), border, ex),   adjVal(ey - (unitHeight * 2), border, ey),      adjVal(sx + (unitWidth * 2), border, ex),   adjVal(ey - (unitHeight * 2), border, ey));
	ctx.quadraticCurveTo(adjVal(sx + unitWidth, border, ex),        adjVal(ey - (unitHeight * 2), border, ey),  adjVal(sx, border, ex),                     adjVal(ey - unitHeight, border, ey));
}

function drawFigureSmile(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	// Drawing the face
	var xCenter = xRadius = width / 2;
	var yCenter = yRadius = height / 2;

	var circular = 0.225;
	var xGap = width * circular;
	var yGap = height * circular;

	ctx.moveTo(adjVal(xCenter, border, width),                          adjVal(yCenter - yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius + xGap, border, width),  adjVal(yCenter - yRadius, border, height),          adjVal(xCenter - xRadius, border, width),           adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter - xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius, border, width),         adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter - xRadius + xGap, border, width),    adjVal(yCenter + yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter + yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius - xGap, border, width),  adjVal(yCenter + yRadius, border, height),          adjVal(xCenter + xRadius, border, width),           adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter + xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius, border, width),         adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter + xRadius - xGap, border, width),    adjVal(yCenter - yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter - yRadius, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Expression Construct
	var f1 = getCoordValue(aryCoordset, "f1", "31.25", "25.00", width, height);     //Eye control points : "F1, 31.25,25.00, 31.25,18.75, 31.25,43.75"
	var f2 = getCoordValue(aryCoordset, "f2", "50.00", "81.25", width, height);     //Mouth control point : "F2, 50.00,81.25, 50.00,62.50, 50.00,87.50"

	var xUnit = width / 16;
	var yUnit = height / 16;

	// Construct the left eye
	var yValue = adjVal(height * f1.curY, border, height);
	var yVirtual = (yValue - (height * 5 / 16)) * 2 + yValue;
	ctx.moveTo(adjVal(xUnit * 3, border, width),                        adjVal(height * ((7 / 16) - f1.curY + (3 / 16)), border, height));
	ctx.quadraticCurveTo(adjVal(width * f1.curX, border, width),        yVirtual,           adjVal(xUnit * 7, border, width),       adjVal(height * ((7 / 16) - f1.curY + (3 / 16)), border, height));
	pathStrokeAndContinue(ctx, fw, bw);

	// Drawing the right eye
	yValue = adjVal(height * f1.curY, border, height);
	yVirtual = (yValue - (height * 5 / 16)) * 2 + yValue;
	ctx.moveTo(adjVal(xUnit * 13, border, width),                       adjVal(height * ((7 / 16) - f1.curY + (3 / 16)), border, height));
	ctx.quadraticCurveTo(adjVal(width * (1 - f1.curX), border, width),  yVirtual,           adjVal(xUnit * 9, border, width),       adjVal(height * ((7 / 16) - f1.curY + (3 / 16)), border, height));
	pathStrokeAndContinue(ctx, fw, bw);

	// Mouth drawn
	yValue = adjVal(height * f2.curY, border, height);
	yVirtual = (yValue - (height * 12 / 16)) * 2 + yValue;
	ctx.moveTo(adjVal(xUnit * 4, border, width),                        adjVal(height * ((14 / 16) - f2.curY + (10 / 16)), border, height));
	ctx.quadraticCurveTo(adjVal(width * f2.curX, border, width),        yVirtual,           adjVal(xUnit * 12, border, width),      adjVal(height * ((14 / 16) - f2.curY + (10 / 16)), border, height));
	pathStrokeAndContinue(ctx, fw, bw);
}

function drawFigureOops(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	// Drawing the face
	var xCenter = xRadius = width / 2;
	var yCenter = yRadius = height / 2;

	var circular = 0.225;
	var xGap = width * circular;
	var yGap = height * circular;

	ctx.moveTo(adjVal(xCenter, border, width),                          adjVal(yCenter - yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius + xGap, border, width),  adjVal(yCenter - yRadius, border, height),          adjVal(xCenter - xRadius, border, width),           adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter - xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius, border, width),         adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter - xRadius + xGap, border, width),    adjVal(yCenter + yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter + yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius - xGap, border, width),  adjVal(yCenter + yRadius, border, height),          adjVal(xCenter + xRadius, border, width),           adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter + xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius, border, width),         adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter + xRadius - xGap, border, width),    adjVal(yCenter - yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter - yRadius, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Expression Construct
	var s1 = getCoordValue(aryCoordset, "s1", "18.75", "25.00", width, height);     //starting point : "S1, 18.75,25.00, 18.75,18.75, 18.75,E1"
	var e1 = getCoordValue(aryCoordset, "e1", "18.75", "37.50", width, height);     //Finish point : "E1, 18.75,37.50, 18.75,S1,    18.75,43.75"
	var v1 = getCoordValue(aryCoordset, "v1", "43.75", "37.50", width, height);     //vertex : "V1, 43.75,37.50, 43.75,18.75, 43.75,43.75"
	var f1 = getCoordValue(aryCoordset, "f1", "50.00", "68.75", width, height);     //Control points : "F1, 50.00,68.75, 50.00,62.50, 50.00,87.50"

	// Construct the left eye
	ctx.moveTo(adjVal(width * s1.curX, border, width),              adjVal(height * s1.curY, border, height));
	ctx.lineTo(adjVal(width * v1.curX, border, width),              adjVal(height * v1.curY, border, height));
	if (!same_XY(s1, e1, border, width, height))
		ctx.lineTo(adjVal(width * e1.curX, border, width),          adjVal(height * e1.curY, border, height));
	pathStrokeAndContinue(ctx, fw, bw);

	// Drawing the right eye
	ctx.moveTo(adjVal(width * (1 - s1.curX), border, width),        adjVal(height * s1.curY, border, height));
	ctx.lineTo(adjVal(width * (1 - v1.curX), border, width),        adjVal(height * v1.curY, border, height));
	if (!same_XY(s1, e1, border, width, height))
		ctx.lineTo(adjVal(width * (1 - e1.curX), border, width),    adjVal(height * e1.curY, border, height));
	pathStrokeAndContinue(ctx, fw, bw);

	// Mouth drawn
	var xUnit = width / 16;
	var yUnit = height / 16;
	var yValue = adjVal(height * f1.curY, border, height);
	var yVirtual = (yValue - (height * 12 / 16)) * 2 + yValue;
	ctx.moveTo(adjVal(xUnit * 4, border, width),                    adjVal(height * ((14 / 16) - f1.curY + (10 / 16)), border, height));
	ctx.quadraticCurveTo(adjVal(width * f1.curX, border, width),    yVirtual,       adjVal(xUnit * 12, border, width),      adjVal(height * ((14 / 16) - f1.curY + (10 / 16)), border, height));
	pathStrokeAndContinue(ctx, fw, bw);
}

function drawFigureSurprise(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	// Drawing the face
	var xCenter = xRadius = width / 2;
	var yCenter = yRadius = height / 2;

	var circular = 0.225;
	var xGap = width * circular;
	var yGap = height * circular;

	ctx.moveTo(adjVal(xCenter, border, width),                          adjVal(yCenter - yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius + xGap, border, width),  adjVal(yCenter - yRadius, border, height),          adjVal(xCenter - xRadius, border, width),           adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter - xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius, border, width),         adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter - xRadius + xGap, border, width),    adjVal(yCenter + yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter + yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius - xGap, border, width),  adjVal(yCenter + yRadius, border, height),          adjVal(xCenter + xRadius, border, width),           adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter + xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius, border, width),         adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter + xRadius - xGap, border, width),    adjVal(yCenter - yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter - yRadius, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Expression Construct
	var xUnit = width / 16;
	var yUnit = height / 16;
	setGradient(ctx, null, 'rgba(255,255,255,0.5)', apply);

	var m1 = getCoordValue(aryCoordset, "m1", "18.75", "18.75", width, height);     //Eye : "M1, 18.75,18.75, 18.75,18.75, 25.00,25.00"
	var xMargin = width * (m1.curX - (3 / 16));
	var yMargin = height * (m1.curY - (3 / 16));
	var xDiameter = (xUnit * 4) - (xMargin * 2);
	var yDiameter = (yUnit * 4) - (yMargin * 2);
	var xRadius = xDiameter / 2;
	var yRadius = yDiameter / 2;

	xGap = xDiameter * circular;
	yGap = yDiameter * circular;

	// Construct the left eye
	xCenter = xUnit * 5;
	yCenter = yUnit * 5;
	ctx.moveTo(adjVal(xCenter, border, width),                          adjVal(yCenter - yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius + xGap, border, width),  adjVal(yCenter - yRadius, border, height),          adjVal(xCenter - xRadius, border, width),           adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter - xRadius, border, width),       adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius, border, width),         adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter - xRadius + xGap, border, width),    adjVal(yCenter + yRadius, border, height),          adjVal(xCenter, border, width),                 adjVal(yCenter + yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius - xGap, border, width),  adjVal(yCenter + yRadius, border, height),          adjVal(xCenter + xRadius, border, width),           adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter + xRadius, border, width),       adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius, border, width),         adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter + xRadius - xGap, border, width),    adjVal(yCenter - yRadius, border, height),          adjVal(xCenter, border, width),                 adjVal(yCenter - yRadius, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing the right eye
	xCenter = xUnit * 11;
	yCenter = yUnit * 5;
	ctx.moveTo(adjVal(xCenter, border, width),                          adjVal(yCenter - yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius + xGap, border, width),  adjVal(yCenter - yRadius, border, height),          adjVal(xCenter - xRadius, border, width),           adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter - xRadius, border, width),       adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius, border, width),         adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter - xRadius + xGap, border, width),    adjVal(yCenter + yRadius, border, height),          adjVal(xCenter, border, width),                 adjVal(yCenter + yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius - xGap, border, width),  adjVal(yCenter + yRadius, border, height),          adjVal(xCenter + xRadius, border, width),           adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter + xRadius, border, width),       adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius, border, width),         adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter + xRadius - xGap, border, width),    adjVal(yCenter - yRadius, border, height),          adjVal(xCenter, border, width),                 adjVal(yCenter - yRadius, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Mouth drawn
	var m2 = getCoordValue(aryCoordset, "m2", "31.25", "56.25", width, height);     //Mouth : "M2, 31.25,56.25, 31.25,56.25, 43.75,68.75"
	var xMargin = width * (m2.curX - (5 / 16));
	var yMargin = height * (m2.curY - (9 / 16));
	var xDiameter = (xUnit * 6) - (xMargin * 2);
	var yDiameter = (yUnit * 6) - (yMargin * 2);
	var xRadius = xDiameter / 2;
	var yRadius = yDiameter / 2;

	xGap = xDiameter * circular;
	yGap = yDiameter * circular;

	xCenter = xUnit * 8;
	yCenter = yUnit * 12;
	ctx.moveTo(adjVal(xCenter, border, width),                          adjVal(yCenter - yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius + xGap, border, width),  adjVal(yCenter - yRadius, border, height),          adjVal(xCenter - xRadius, border, width),           adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter - xRadius, border, width),       adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius, border, width),         adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter - xRadius + xGap, border, width),    adjVal(yCenter + yRadius, border, height),          adjVal(xCenter, border, width),                 adjVal(yCenter + yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius - xGap, border, width),  adjVal(yCenter + yRadius, border, height),          adjVal(xCenter + xRadius, border, width),           adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter + xRadius, border, width),       adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius, border, width),         adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter + xRadius - xGap, border, width),    adjVal(yCenter - yRadius, border, height),          adjVal(xCenter, border, width),                 adjVal(yCenter - yRadius, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Eye
	var o1 = getCoordValue(aryCoordset, "o1", "31.25", "31.25", width, height);   //pupil : "O1, 31.25,31.25, M1+2.5,M1+2.5, 62.5-M1-2.5,62.5-M1-2.5"
	xRadius = width / 16;
	yRadius = height / 16;
	xGap = xRadius * 2 * circular;
	yGap = yRadius * 2 * circular;
	ctx.fillStyle = getDrawColor(fillColor, 'dark');
	//Except for the gradient applies.
	//setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);

	xCenter = width * o1.curX;
	yCenter = height * o1.curY;
	ctx.moveTo(adjVal(xCenter, border, width),                          adjVal(yCenter - yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius + xGap, border, width),  adjVal(yCenter - yRadius, border, height),          adjVal(xCenter - xRadius, border, width),           adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter - xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius, border, width),         adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter - xRadius + xGap, border, width),    adjVal(yCenter + yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter + yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius - xGap, border, width),  adjVal(yCenter + yRadius, border, height),          adjVal(xCenter + xRadius, border, width),           adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter + xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius, border, width),         adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter + xRadius - xGap, border, width),    adjVal(yCenter - yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter - yRadius, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	xCenter = width * (1 - o1.curX);
	yCenter = height * o1.curY;
	ctx.moveTo(adjVal(xCenter, border, width),                          adjVal(yCenter - yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius + xGap, border, width),  adjVal(yCenter - yRadius, border, height),          adjVal(xCenter - xRadius, border, width),           adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter - xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter - xRadius, border, width),         adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter - xRadius + xGap, border, width),    adjVal(yCenter + yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter + yRadius, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius - xGap, border, width),  adjVal(yCenter + yRadius, border, height),          adjVal(xCenter + xRadius, border, width),           adjVal(yCenter + yRadius - yGap, border, height),   adjVal(xCenter + xRadius, border, width),   adjVal(yCenter, border, height));
	ctx.bezierCurveTo(adjVal(xCenter + xRadius, border, width),         adjVal(yCenter - yRadius + yGap, border, height),   adjVal(xCenter + xRadius - xGap, border, width),    adjVal(yCenter - yRadius, border, height),          adjVal(xCenter, border, width),             adjVal(yCenter - yRadius, border, height));
	pathCloseAndContinue(ctx, fw, bw);
}

function drawFigurePyramid(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var v1 = getCoordValue(aryCoordset, "v1", "0", "75", width, height);       //vertex1 : "V1, 0,75, 0,75, 0,100"
	var v2 = getCoordValue(aryCoordset, "v2", "50", "100", width, height);     //vertex2 : "V2, 50,100, 25,100, 75,100"

	// Construct the left side
	setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                adjVal(height * v1.curY, border, height));
	ctx.lineTo(adjVal(width * v2.curX, border, width),  adjVal(height, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Right Side
	setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width),            adjVal(height * v1.curY, border, height));
	ctx.lineTo(adjVal(width * v2.curX, border, width),  adjVal(height, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// <> construction
		ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
		ctx.lineTo(adjVal(0, border, width),                adjVal(height * v1.curY, border, height));
		ctx.lineTo(adjVal(width * v2.curX, border, width),  adjVal(height, border, height));
		ctx.lineTo(adjVal(width, border, width),            adjVal(height * v1.curY, border, height));
		pathCloseAndContinue(ctx, fw, bw);
		// | construction
		ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
		ctx.lineTo(adjVal(width * v2.curX, border, width),  adjVal(height, border, height));
	}
}

function drawFigurePyramidDotted(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var v1 = getCoordValue(aryCoordset, "v1", "0", "75", width, height);       //vertex1 : "V1, 0,75, 0,75, 0,100"
	var v2 = getCoordValue(aryCoordset, "v2", "50", "100", width, height);     //vertex2 : "V2, 50,100, 25,100, 75,100"

	// Drawing back (optional)
	//setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	//ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
	//ctx.lineTo(adjVal(0, border, width),                adjVal(height * v1.curY, border, height));
	//ctx.lineTo(adjVal(width, border, width),            adjVal(height * v1.curY, border, height));
	//pathCloseAndContinue(ctx, fw, bw);

	// Construct the left side 
	setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                adjVal(height * v1.curY, border, height));
	ctx.lineTo(adjVal(width * v2.curX, border, width),  adjVal(height, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Right Side
	setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width),            adjVal(height * v1.curY, border, height));
	ctx.lineTo(adjVal(width * v2.curX, border, width),  adjVal(height, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Bottom construction
	setDrawColor(ctx, border, borderColor, fillColor, 'dark', apply);
	ctx.moveTo(adjVal(0, border, width),                adjVal(height * v1.curY, border, height));
	ctx.lineTo(adjVal(width * v2.curX, border, width),  adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),            adjVal(height * v1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		// Construct the other side border
		setDrawColor(ctx, border, borderColor, fillColor, 'transparent', apply);
		// - construction
		ctx.moveTo(adjVal(0, border, width),                adjVal(height * v1.curY, border, height));
		ctx.lineTo(adjVal(width, border, width),            adjVal(height * v1.curY, border, height));
		pathStrokeAndContinue(ctx, border * 2, border);

		// Drawing a border surface
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// <> construction
		ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
		ctx.lineTo(adjVal(0, border, width),                adjVal(height * v1.curY, border, height));
		ctx.lineTo(adjVal(width * v2.curX, border, width),  adjVal(height, border, height));
		ctx.lineTo(adjVal(width, border, width),            adjVal(height * v1.curY, border, height));
		pathCloseAndContinue(ctx, fw, bw);
		// | construction
		ctx.moveTo(adjVal(width / 2, border, width),        adjVal(0, border, height));
		ctx.lineTo(adjVal(width * v2.curX, border, width),  adjVal(height, border, height));
	}
}

function drawFigurePyramidDotted2(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var v1 = getCoordValue(aryCoordset, "v1", "0", "75", width, height);       //vertex1 : "V1, 0,75, 0,75, 0,100"
	var v2 = getCoordValue(aryCoordset, "v2", "50", "100", width, height);     //vertex2 : "V2, 50,100, 25,100, 75,100"

	// Drawing the back left side
	setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	ctx.moveTo(adjVal(width / 2, border, width),                adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height * v1.curY, border, height));
	ctx.lineTo(adjVal(width * (1 - v2.curX), border, width),    adjVal(height * (v1.curY - (v2.curY - v1.curY)), border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing the front left side (skip)
	//setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	//ctx.moveTo(adjVal(width / 2, border, width),                adjVal(0, border, height));
	//ctx.lineTo(adjVal(0, border, width),                        adjVal(height * v1.curY, border, height));
	//ctx.lineTo(adjVal(width * v2.curX, border, width),          adjVal(height, border, height));
	//pathCloseAndContinue(ctx, fw, bw);

	// Drawing the front Right Side (skip)
	//setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	//ctx.moveTo(adjVal(width / 2, border, width),                adjVal(0, border, height));
	//ctx.lineTo(adjVal(width * v2.curX, border, width),          adjVal(height, border, height));
	//ctx.lineTo(adjVal(width, border, width),                    adjVal(height * v1.curY, border, height));
	//pathCloseAndContinue(ctx, fw, bw);

	// Drawing the back Right Side
	setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	ctx.moveTo(adjVal(width / 2, border, width),                adjVal(0, border, height));
	ctx.lineTo(adjVal(width * (1 - v2.curX), border, width),    adjVal(height * (v1.curY - (v2.curY - v1.curY)), border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(height * v1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Bottom construction
	setDrawColor(ctx, border, borderColor, fillColor, 'dark', apply);
	ctx.moveTo(adjVal(width * (1 - v2.curX), border, width),    adjVal(height * (v1.curY - (v2.curY - v1.curY)), border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height * v1.curY, border, height));
	ctx.lineTo(adjVal(width * v2.curX, border, width),          adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(height * v1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		// Construct the other side border
		setDrawColor(ctx, border, borderColor, fillColor, 'transparent', apply);
		// |^ construction
		ctx.moveTo(adjVal(width * (1 - v2.curX), border, width),    adjVal(height * (v1.curY - (v2.curY - v1.curY)), border, height));
		ctx.lineTo(adjVal(width / 2, border, width),                adjVal(0, border, height));
		ctx.moveTo(adjVal(width * (1 - v2.curX), border, width),    adjVal(height * (v1.curY - (v2.curY - v1.curY)), border, height));
		ctx.lineTo(adjVal(0, border, width),                        adjVal(height * v1.curY, border, height));
		ctx.moveTo(adjVal(width * (1 - v2.curX), border, width),    adjVal(height * (v1.curY - (v2.curY - v1.curY)), border, height));
		ctx.lineTo(adjVal(width, border, width),                    adjVal(height * v1.curY, border, height));
		pathStrokeAndContinue(ctx, border * 2, border);

		// Drawing a border surface
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// <> construction
		ctx.moveTo(adjVal(width / 2, border, width),            adjVal(0, border, height));
		ctx.lineTo(adjVal(0, border, width),                    adjVal(height * v1.curY, border, height));
		ctx.lineTo(adjVal(width * v2.curX, border, width),      adjVal(height, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(height * v1.curY, border, height));
		pathCloseAndContinue(ctx, fw, bw);
		// | construction
		ctx.moveTo(adjVal(width / 2, border, width),            adjVal(0, border, height));
		ctx.lineTo(adjVal(width * v2.curX, border, width),      adjVal(height, border, height));
	}
}

function drawFigureCylinder(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var h1 = getCoordValue(aryCoordset, "h1", "0", "15", width, height);    //Height point : "H1, 0,15, 0,0, 0,50"
	var adjBezier = height * h1.curY / 3 - (parseInt(border / 3) + 1);

	// Top circles drawn
	setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(0, border, width),     0 - adjBezier,                              adjVal(width, border, width),   0 - adjBezier,                      adjVal(width, border, width),   adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing cylindrical
	setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
	ctx.lineTo(adjVal(0, border, width),            adjVal(height * (1 - h1.curY), border, height));
	ctx.bezierCurveTo(adjVal(0, border, width),     height + adjBezier,                         adjVal(width, border, width),   height + adjBezier,                 adjVal(width, border, width),   adjVal(height * (1 - h1.curY), border, height));
	ctx.lineTo(adjVal(width, border, width),        adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// Drawing the top border
		ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
		ctx.bezierCurveTo(adjVal(0, border, width),     0 - adjBezier,                              adjVal(width, border, width),   0 - adjBezier,                      adjVal(width, border, width),   adjVal(height * h1.curY, border, height));
		ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
		// Drawing cylindrical rim
		ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
		ctx.lineTo(adjVal(0, border, width),            adjVal(height * (1 - h1.curY), border, height));
		ctx.bezierCurveTo(adjVal(0, border, width),     height + adjBezier,                         adjVal(width, border, width),   height + adjBezier,                 adjVal(width, border, width),   adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(width, border, width),        adjVal(height * h1.curY, border, height));
		ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
	}
}

function drawFigureCylinderDotted(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var h1 = getCoordValue(aryCoordset, "h1", "0", "15", width, height);    //Height point : "H1, 0,15, 0,0, 0,50"
	var adjBezier = height * h1.curY / 3 - (parseInt(border / 3) + 1);

	// Top circles drawn
	setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(0, border, width),     0 - adjBezier,                              adjVal(width, border, width),   0 - adjBezier,                      adjVal(width, border, width),   adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing cylindrical
	setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
	ctx.lineTo(adjVal(0, border, width),            adjVal(height * (1 - h1.curY), border, height));
	ctx.bezierCurveTo(adjVal(0, border, width),     height * (1 - (h1.curY * 2)) - adjBezier,   adjVal(width, border, width),   height * (1 - (h1.curY * 2)) - adjBezier,   adjVal(width, border, width),   adjVal(height * (1 - h1.curY), border, height));
	ctx.lineTo(adjVal(width, border, width),        adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing the bottom circle
	setDrawColor(ctx, border, borderColor, fillColor, 'dark', apply);
	ctx.moveTo(adjVal(0, border, width),            adjVal(height * (1 - h1.curY), border, height));
	ctx.bezierCurveTo(adjVal(0, border, width),     height * (1 - (h1.curY * 2)) - adjBezier,   adjVal(width, border, width),   height * (1 - (h1.curY * 2)) - adjBezier,   adjVal(width, border, width),   adjVal(height * (1 - h1.curY), border, height));
	ctx.bezierCurveTo(adjVal(width, border, width), height + adjBezier,                         adjVal(0, border, width),       height + adjBezier,                         adjVal(0, border, width),       adjVal(height * (1 - h1.curY), border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		// Construct the other side border
		setDrawColor(ctx, border, borderColor, fillColor, 'transparent', apply);
		ctx.moveTo(adjVal(0, border, width),            adjVal(height * (1 - h1.curY), border, height));
		ctx.bezierCurveTo(adjVal(0, border, width),     height * (1 - (h1.curY * 2)) - adjBezier,   adjVal(width, border, width),   height * (1 - (h1.curY * 2)) - adjBezier,   adjVal(width, border, width),   adjVal(height * (1 - h1.curY), border, height));
		ctx.moveTo(adjVal(width, border, width),        adjVal(height * (1 - h1.curY), border, height)); // Path End.
		pathStrokeAndContinue(ctx, border * 2, border);

		// Drawing a border surface
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// Drawing the top edge
		ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
		ctx.bezierCurveTo(adjVal(0, border, width),     0 - adjBezier,                              adjVal(width, border, width),   0 - adjBezier,                      adjVal(width, border, width),   adjVal(height * h1.curY, border, height));
		ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
		// Drawing cylindrical rim
		ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
		ctx.lineTo(adjVal(0, border, width),            adjVal(height * (1 - h1.curY), border, height));
		ctx.bezierCurveTo(adjVal(0, border, width),     height + adjBezier,                         adjVal(width, border, width),   height + adjBezier,                 adjVal(width, border, width),   adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(width, border, width),        adjVal(height * h1.curY, border, height));
		ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
	}
}

function drawFigureHexahedron(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var h1 = getCoordValue(aryCoordset, "h1", "0", "25", width, height);   //Height point : "H1, 0,25, 0,0, 0,100@MIN(100_W:100_H)"
	var h1Value = Math.min(height * h1.curY, width);

	// Construct the top surface
	setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	ctx.moveTo(adjVal(0, border, width),                    adjVal(h1Value, border, height));
	ctx.lineTo(adjVal(h1Value, border, width),              adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
	ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing front
	setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	ctx.moveTo(adjVal(0, border, width),                    adjVal(h1Value, border, height));
	ctx.lineTo(adjVal(0, border, width),                    adjVal(height, border, height));
	ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(height, border, height));
	ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Right Side
	setDrawColor(ctx, border, borderColor, fillColor, 'dark', apply);
	ctx.moveTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
	ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(height - h1Value, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// Outside the borders / - | / _ | construction
		ctx.moveTo(adjVal(0, border, width),                    adjVal(h1Value, border, height));
		ctx.lineTo(adjVal(h1Value, border, width),              adjVal(0, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(height - h1Value, border, height));
		ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(height, border, height));
		ctx.lineTo(adjVal(0, border, width),                    adjVal(height, border, height));
		pathCloseAndContinue(ctx, fw, bw);
		// Internal borders - / | construction
		ctx.moveTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
		ctx.lineTo(adjVal(0, border, width),                    adjVal(h1Value, border, height));
		ctx.moveTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
		ctx.moveTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
		ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(height, border, height));
	}
}

function drawFigureHexahedronDotted(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var h1 = getCoordValue(aryCoordset, "h1", "0", "25", width, height);   //Height point : "H1, 0,25, 0,0, 0,100@MIN(100_W:100_H)"
	var h1Value = Math.min(height * h1.curY, width);

	// Construct the top surface
	setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	ctx.moveTo(adjVal(0, border, width),                    adjVal(h1Value, border, height));
	ctx.lineTo(adjVal(h1Value, border, width),              adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
	ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Construct the left side (skip)
	//setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	//ctx.moveTo(adjVal(h1Value, border, width),            adjVal(0, border, height));
	//ctx.lineTo(adjVal(0, border, width),                  adjVal(h1Value, border, height));
	//ctx.lineTo(adjVal(0, border, width),                  adjVal(height, border, height));
	//ctx.lineTo(adjVal(h1Value, border, width),            adjVal(height - h1Value, border, height));
	//pathCloseAndContinue(ctx, fw, bw);

	// Drawing front
	setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	ctx.moveTo(adjVal(0, border, width),                    adjVal(h1Value, border, height));
	ctx.lineTo(adjVal(0, border, width),                    adjVal(height, border, height));
	ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(height, border, height));
	ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing back - only draws some overlap with the front part (skip)
	//if ((h1Value < width / 2) && (h1Value < height / 2)) {
	//    setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	//    ctx.moveTo(adjVal(h1Value, border, width),          adjVal(h1Value, border, height));
	//    ctx.lineTo(adjVal(h1Value, border, width),          adjVal(height - h1Value, border, height));
	//    ctx.lineTo(adjVal(width - h1Value, border, width),  adjVal(height - h1Value, border, height));
	//    ctx.lineTo(adjVal(width - h1Value, border, width),  adjVal(h1Value, border, height));
	//    pathCloseAndContinue(ctx, fw, bw);
	// }

	// Drawing Right Side
	setDrawColor(ctx, border, borderColor, fillColor, 'dark', apply);
	ctx.moveTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
	ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(height - h1Value, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Bottom construction (skip)
	//setDrawColor(ctx, border, borderColor, fillColor, 'deepdark', apply);
	//ctx.moveTo(adjVal(0, border, width),                    adjVal(height, border, height));
	//ctx.lineTo(adjVal(h1Value, border, width),              adjVal(height - h1Value, border, height));
	//ctx.lineTo(adjVal(width, border, width),                adjVal(height - h1Value, border, height));
	//ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(height, border, height));
	//pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		// Construct the other side border
		setDrawColor(ctx, border, borderColor, fillColor, 'transparent', apply);
		ctx.moveTo(adjVal(h1Value, border, width),              adjVal(height - h1Value, border, height));
		ctx.lineTo(adjVal(h1Value, border, width),              adjVal(0, border, height));
		ctx.moveTo(adjVal(h1Value, border, width),              adjVal(height - h1Value, border, height));
		ctx.lineTo(adjVal(0, border, width),                    adjVal(height, border, height));
		ctx.moveTo(adjVal(h1Value, border, width),              adjVal(height - h1Value, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(height - h1Value, border, height));
		pathStrokeAndContinue(ctx, border * 2, border);

		// Drawing a border surface
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// Outside the borders / - | / _ | construction
		ctx.moveTo(adjVal(0, border, width),                    adjVal(h1Value, border, height));
		ctx.lineTo(adjVal(h1Value, border, width),              adjVal(0, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(height - h1Value, border, height));
		ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(height, border, height));
		ctx.lineTo(adjVal(0, border, width),                    adjVal(height, border, height));
		pathCloseAndContinue(ctx, fw, bw);
		// Internal borders - / | construction
		ctx.moveTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
		ctx.lineTo(adjVal(0, border, width),                    adjVal(h1Value, border, height));
		ctx.moveTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
		ctx.moveTo(adjVal(width - h1Value, border, width),      adjVal(h1Value, border, height));
		ctx.lineTo(adjVal(width - h1Value, border, width),      adjVal(height, border, height));
	}
}

function drawFigureIconPushbutton(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var t1 = getCoordValue(aryCoordset, "t1", "0", "15", width, height);   // Thickness point : "T1, 0,15, 0,0, 0,33@MIN(100_W:100_H)"
	var t1Value = height * t1.curY;

	// Construct the top surface
	setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	ctx.moveTo(adjVal(0, border, width),                    adjVal(0, border, height));
	ctx.lineTo(adjVal(t1Value, border, width),              adjVal(t1Value, border, height));
	ctx.lineTo(adjVal(width - t1Value, border, width),      adjVal(t1Value, border, height));
	ctx.lineTo(adjVal(width + t1Value, border, width),      adjVal(0, border, height));
	pathCloseAndContinue(ctx, fw, bw);
	// Construct the left side
	ctx.moveTo(adjVal(0, border, width),                    adjVal(0, border, height));
	ctx.lineTo(adjVal(t1Value, border, width),              adjVal(t1Value, border, height));
	ctx.lineTo(adjVal(t1Value, border, width),              adjVal(height - t1Value, border, height));
	ctx.lineTo(adjVal(0, border, width),                    adjVal(height, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Right Side
	setDrawColor(ctx, border, borderColor, fillColor, 'dark', apply);
	ctx.moveTo(adjVal(width, border, width),                adjVal(0, border, height));
	ctx.lineTo(adjVal(width - t1Value, border, width),      adjVal(t1Value, border, height));
	ctx.lineTo(adjVal(width - t1Value, border, width),      adjVal(height - t1Value, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(height, border, height));
	pathCloseAndContinue(ctx, fw, bw);
	// Drawing the bottom surface
	ctx.moveTo(adjVal(0, border, width),                    adjVal(height, border, height));
	ctx.lineTo(adjVal(t1Value, border, width),              adjVal(height - t1Value, border, height));
	ctx.lineTo(adjVal(width - t1Value, border, width),      adjVal(height - t1Value, border, height));
	ctx.lineTo(adjVal(width, border, width),                adjVal(height, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing front
	setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	ctx.moveTo(adjVal(t1Value, border, width),              adjVal(t1Value, border, height));
	ctx.lineTo(adjVal(t1Value, border, width),              adjVal(height - t1Value, border, height));
	ctx.lineTo(adjVal(width - t1Value, border, width),      adjVal(height - t1Value, border, height));
	ctx.lineTo(adjVal(width - t1Value, border, width),      adjVal(t1Value, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// Outside the borders drawn
		ctx.moveTo(adjVal(0, border, width),                adjVal(0, border, height));
		ctx.lineTo(adjVal(0, border, width),                adjVal(height, border, height));
		ctx.lineTo(adjVal(width, border, width),            adjVal(height, border, height));
		ctx.lineTo(adjVal(width, border, width),            adjVal(0, border, height));
		pathCloseAndContinue(ctx, fw, bw);
		// Internal borders drawn
		ctx.moveTo(adjVal(t1Value, border, width),          adjVal(t1Value, border, height));
		ctx.lineTo(adjVal(t1Value, border, width),          adjVal(height - t1Value, border, height));
		ctx.lineTo(adjVal(width - t1Value, border, width),  adjVal(height - t1Value, border, height));
		ctx.lineTo(adjVal(width - t1Value, border, width),  adjVal(t1Value, border, height));
		pathCloseAndContinue(ctx, fw, bw);
		// Drawing Connection
		ctx.moveTo(adjVal(t1Value, border, width),          adjVal(t1Value, border, height));
		ctx.lineTo(adjVal(0, border, width),                adjVal(0, border, height));
		ctx.moveTo(adjVal(t1Value, border, width),          adjVal(height - t1Value, border, height));
		ctx.lineTo(adjVal(0, border, width),                adjVal(height, border, height));
		ctx.moveTo(adjVal(width - t1Value, border, width),  adjVal(t1Value, border, height));
		ctx.lineTo(adjVal(width, border, width),            adjVal(0, border, height));
		ctx.moveTo(adjVal(width - t1Value, border, width),  adjVal(height - t1Value, border, height));
		ctx.lineTo(adjVal(width, border, width),            adjVal(height, border, height));
	}
}

// Icons shape function ====================================================================================
function drawFigureIconPlayBackward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// | construction
	ctx.moveTo(adjVal(centerX + halfSize, border, width),                   adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),                   adjVal(centerY + halfSize, border, height));

	// /_| construction
	ctx.moveTo(adjVal(centerX + halfSize - (border * 2), border, width),    adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),                   adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(centerX + halfSize - (border * 2), border, width),    adjVal(centerY + halfSize, border, height));
}

function drawFigureIconPlayForward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// | construction
	ctx.moveTo(adjVal(centerX - halfSize, border, width),                   adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),                   adjVal(centerY + halfSize, border, height));

	// /_| construction
	ctx.moveTo(adjVal(centerX - halfSize + (border * 2), border, width),    adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),                   adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(centerX - halfSize + (border * 2), border, width),    adjVal(centerY + halfSize, border, height));
}

function drawFigureIconFastBackward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// /_| construction
	ctx.moveTo(adjVal(centerX, border, width),              adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),   adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX, border, width),              adjVal(centerY + halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// /_| construction
	ctx.moveTo(adjVal(centerX + halfSize, border, width),   adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX, border, width),              adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),   adjVal(centerY + halfSize, border, height));
}

function drawFigureIconFastForward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// /_| construction
	ctx.moveTo(adjVal(centerX, border, width),              adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),   adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX, border, width),              adjVal(centerY + halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// /_| construction
	ctx.moveTo(adjVal(centerX - halfSize, border, width),   adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX, border, width),              adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),   adjVal(centerY + halfSize, border, height));
}

function drawFigureIconGotoStart(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var barWidth = halfSize / 3;
	var centerX = width / 2;
	var centerY = height / 2;

	// | construction
	ctx.moveTo(adjVal(centerX - halfSize, border, width),                       adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),                       adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize + barWidth, border, width),            adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize + barWidth, border, width),            adjVal(centerY - halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// /_| construction
	ctx.moveTo(adjVal(centerX + halfSize, border, width),                       adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize + barWidth + border, border, width),   adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),                       adjVal(centerY + halfSize, border, height));
}

function drawFigureIconGotoEnd(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var barWidth = halfSize / 3;
	var centerX = width / 2;
	var centerY = height / 2;

	// | construction
	ctx.moveTo(adjVal(centerX + halfSize, border, width),                       adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),                       adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize - barWidth, border, width),            adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize - barWidth, border, width),            adjVal(centerY - halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// /_| construction
	ctx.moveTo(adjVal(centerX - halfSize, border, width),                       adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize - barWidth - border, border, width),   adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),                       adjVal(centerY + halfSize, border, height));
}

function drawFigureIconPause(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var barWidth = halfSize / 3.5;
	var centerX = width / 2;
	var centerY = height / 2;

	// | construction
	ctx.moveTo(adjVal(centerX - halfSize + barWidth, border, width),    adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize + barWidth, border, width),    adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX - (barWidth / 2), border, width),         adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX - (barWidth / 2), border, width),         adjVal(centerY - halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// | construction
	ctx.moveTo(adjVal(centerX + (barWidth / 2), border, width),         adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX + (barWidth / 2), border, width),         adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize - barWidth, border, width),    adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize - barWidth, border, width),    adjVal(centerY - halfSize, border, height));
}

function drawFigureIconStop(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// □ construction
	ctx.moveTo(adjVal(centerX - halfSize, border, width),           adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),           adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),           adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),           adjVal(centerY - halfSize, border, height));
}

function drawFigureIconSound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// [ ] construction
	ctx.moveTo(adjVal(centerX - (halfSize / 3), border, width),     adjVal(centerY - (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),           adjVal(centerY - (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),           adjVal(centerY + (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX - (halfSize / 3), border, width),     adjVal(centerY + (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX + (halfSize / 3), border, width),     adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + (halfSize / 3), border, width),     adjVal(centerY - halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// ))) construction
	ctx.moveTo(adjVal(centerX + (halfSize * 5 / 9), border, width), adjVal(centerY - (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),           adjVal(centerY - (halfSize * 2 / 3), border, height));
	ctx.moveTo(adjVal(centerX + (halfSize * 5 / 9), border, width), adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),           adjVal(centerY, border, height));
	ctx.moveTo(adjVal(centerX + (halfSize * 5 / 9), border, width), adjVal(centerY + (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),           adjVal(centerY + (halfSize * 2 / 3), border, height));
}

function drawFigureIconMute(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// [ ] construction
	ctx.moveTo(adjVal(centerX - (halfSize / 3), border, width),     adjVal(centerY - (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),           adjVal(centerY - (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),           adjVal(centerY + (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX - (halfSize / 3), border, width),     adjVal(centerY + (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX + (halfSize / 3), border, width),     adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + (halfSize / 3), border, width),     adjVal(centerY - halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// X construction
	ctx.moveTo(adjVal(centerX + (halfSize * 5 / 9), border, width), adjVal(centerY - (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),           adjVal(centerY + (halfSize / 3), border, height));
	ctx.moveTo(adjVal(centerX + (halfSize * 5 / 9), border, width), adjVal(centerY + (halfSize / 3), border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),           adjVal(centerY - (halfSize / 3), border, height));
}

function drawFigureIconVideo(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var unitSize = Math.min(width, height) / 10;
	var centerX = width / 2;
	var centerY = height / 2;

	// Drawing the top film canister
	ctx.arc(adjVal(centerX - (unitSize * 3), border, width),  adjVal(centerY - (unitSize * 3), border, height),     adjVal(unitSize * 2, border, unitSize * 2),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);
	ctx.arc(adjVal(centerX + (unitSize * 1), border, width),  adjVal(centerY - (unitSize * 3), border, height),     adjVal(unitSize * 2, border, unitSize * 2),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);

	// Right-shield construction
	ctx.moveTo(adjVal(centerX + (unitSize * 5), border, width),   adjVal(centerY - (unitSize * 1), border, height));
	ctx.lineTo(adjVal(centerX + (unitSize * 3), border, width),   adjVal(centerY + (unitSize * 1), border, height));
	ctx.lineTo(adjVal(centerX + (unitSize * 3), border, width),   adjVal(centerY + (unitSize * 3), border, height));
	ctx.lineTo(adjVal(centerX + (unitSize * 5), border, width),   adjVal(centerY + (unitSize * 5), border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Body construction
	ctx.moveTo(adjVal(centerX - (unitSize * 5), border, width),   adjVal(centerY - (unitSize * 1), border, height));
	ctx.lineTo(adjVal(centerX - (unitSize * 5), border, width),   adjVal(centerY + (unitSize * 5), border, height));
	ctx.lineTo(adjVal(centerX + (unitSize * 3), border, width),   adjVal(centerY + (unitSize * 5), border, height));
	ctx.lineTo(adjVal(centerX + (unitSize * 3), border, width),   adjVal(centerY - (unitSize * 1), border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing a small film canister
	setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.arc(adjVal(centerX - (unitSize * 3), border, width),  adjVal(centerY - (unitSize * 3), border, height),     adjVal(unitSize / 2, border, unitSize),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);
	ctx.arc(adjVal(centerX + (unitSize * 1), border, width),  adjVal(centerY - (unitSize * 3), border, height),     adjVal(unitSize / 2, border, unitSize),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing a small body
	setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.moveTo(adjVal(centerX - (unitSize * 3), border, width),   adjVal(centerY + (unitSize * 1), border, height));
	ctx.lineTo(adjVal(centerX - (unitSize * 3), border, width),   adjVal(centerY + (unitSize * 3), border, height));
	ctx.lineTo(adjVal(centerX + (unitSize * 1), border, width),   adjVal(centerY + (unitSize * 3), border, height));
	ctx.lineTo(adjVal(centerX + (unitSize * 1), border, width),   adjVal(centerY + (unitSize * 1), border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing power symbol
	setGradient(ctx, null, 'rgba(255,255,255,0.5)', apply);
	ctx.arc(adjVal(centerX + (unitSize * 2), border, width),  adjVal(centerY + (unitSize * 0), border, height),     adjVal(unitSize / 3, border, unitSize),     0,  Math.PI * 2,    false);
}

function drawFigureIconAudio(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var unitSize = Math.min(width, height) / 16;
	var centerX = width / 2;
	var centerY = height / 2;

	// Drawing scale-digit
	ctx.arc(adjVal(centerX - (unitSize * 5), border, width),        adjVal(centerY + (unitSize * 5), border, height),   adjVal(unitSize * 3, border, unitSize * 3),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);
	ctx.arc(adjVal(centerX + (unitSize * 5), border, width),        adjVal(centerY + (unitSize * 2), border, height),   adjVal(unitSize * 3, border, unitSize * 3),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);

	// Note stems and tails construction
	var posX1 = centerX - (unitSize * 2);
	var posX2 = centerX + (unitSize * 8);
	ctx.moveTo(adjVal(posX1, border, posX1),    adjVal(centerY - (unitSize * 5), border, height));
	ctx.lineTo(adjVal(posX1, border, posX1),    adjVal(centerY + (unitSize * 5), border, height));
	ctx.moveTo(adjVal(posX2, border, posX2),    adjVal(centerY - (unitSize * 8), border, height));
	ctx.lineTo(adjVal(posX2, border, posX2),    adjVal(centerY + (unitSize * 2), border, height));
	ctx.moveTo(adjVal(posX1, border, posX1),    adjVal(centerY - (unitSize * 5), border, height));
	ctx.lineTo(adjVal(posX1, border, posX1),    adjVal(centerY - (unitSize * 3), border, height));
	ctx.lineTo(adjVal(posX2, border, posX2),    adjVal(centerY - (unitSize * 8), border, height) + (unitSize * 2));
	ctx.lineTo(adjVal(posX2, border, posX2),    adjVal(centerY - (unitSize * 8), border, height));
}

function drawFigureIconDocument(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var halfWidth = halfSize * 0.75;
	var centerX = width / 2;
	var centerY = height / 2;

	// [] construction
	ctx.moveTo(adjVal(centerX - halfWidth, border, width),                      adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfWidth, border, width),                      adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfWidth, border, width),                      adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfWidth, border, width),                      adjVal(centerY - (halfSize / 2), border, height));
	ctx.lineTo(adjVal(centerX + halfWidth - (halfSize  / 2), border, width),    adjVal(centerY - halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing a folded corner
	ctx.fillStyle = getDrawColor(fillColor, 'dark');
	//Except for the gradient applies.
	//setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.moveTo(adjVal(centerX + halfWidth - (halfSize / 2), border, width),     adjVal(centerY - halfSize + border, border, height));
	ctx.lineTo(adjVal(centerX + halfWidth - (halfSize / 2), border, width),     adjVal(centerY - (halfSize / 2), border, height));
	ctx.lineTo(adjVal(centerX + halfWidth - border, border, width),             adjVal(centerY - (halfSize / 2), border, height));
}

function drawFigureIconHome(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var halfBody = halfSize * 0.75;
	var halfDoor = halfSize * 0.25;
	var centerX = width / 2;
	var centerY = height / 2;

	// Body construction
	ctx.moveTo(adjVal(centerX - halfBody, border, width),                   adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX - halfBody, border, width),                   adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfBody, border, width),                   adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX + halfBody, border, width),                   adjVal(centerY, border, height));
	// Chimney construction
	ctx.lineTo(adjVal(centerX + halfBody - (halfDoor / 2), border, width),  adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX + halfBody - (halfDoor / 2), border, width),  adjVal(centerY - halfSize + halfDoor, border, height));
	ctx.lineTo(adjVal(centerX + (halfDoor * 1.5), border, width),           adjVal(centerY - halfSize + halfDoor, border, height));
	ctx.lineTo(adjVal(centerX + (halfDoor * 1.5), border, width),           adjVal(centerY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Doors
	setGradient(ctx, null, getDrawColor(fillColor, 'dark'), apply);
	ctx.moveTo(adjVal(centerX - halfDoor, border, width),                   adjVal(centerY + halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfDoor, border, width),                   adjVal(centerY + (halfSize / 2), border, height));
	ctx.lineTo(adjVal(centerX + halfDoor, border, width),                   adjVal(centerY + (halfSize / 2), border, height));
	ctx.lineTo(adjVal(centerX + halfDoor, border, width),                   adjVal(centerY + halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);
	// Construction of line
	ctx.moveTo(adjVal(centerX, border, width),                              adjVal(centerY + (halfSize / 2), border, height));
	ctx.lineTo(adjVal(centerX, border, width),                              adjVal(centerY + halfSize, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Roof constructions
	ctx.moveTo(adjVal(centerX, border, width),                              adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),                   adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX + halfSize, border, width),                   adjVal(centerY, border, height));
}

function drawFigureIconReturn(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// <-| construction
	ctx.moveTo(adjVal(centerX, border, width),                      adjVal(centerY + halfSize, border, height));
	ctx.arcTo(adjVal(centerX + halfSize, border, width),            adjVal(centerY + halfSize, border, height),             adjVal(centerX + halfSize, border, width),          adjVal(centerY, border, height),                        halfSize / 2);
	ctx.arcTo(adjVal(centerX + halfSize, border, width),            adjVal(centerY - (halfSize * 0.75), border, height),    adjVal(centerX, border, width),                     adjVal(centerY - (halfSize * 0.75), border, height),    halfSize / 2);
	ctx.lineTo(adjVal(centerX, border, width),                      adjVal(centerY - (halfSize * 0.75), border, height));
	ctx.lineTo(adjVal(centerX, border, width),                      adjVal(centerY - halfSize, border, height));
	ctx.lineTo(adjVal(centerX - halfSize, border, width),           adjVal(centerY - (halfSize / 2), border, height));
	ctx.lineTo(adjVal(centerX, border, width),                      adjVal(centerY, border, height));
	ctx.lineTo(adjVal(centerX, border, width),                      adjVal(centerY - (halfSize * 0.25), border, height));
	ctx.lineTo(adjVal(centerX + (halfSize / 3), border, width),     adjVal(centerY - (halfSize * 0.25), border, height));
	ctx.arcTo(adjVal(centerX + (halfSize / 2), border, width),      adjVal(centerY - (halfSize * 0.25), border, height),    adjVal(centerX + (halfSize / 2), border, width),    adjVal(centerY, border, height),                        halfSize / 4);
	ctx.arcTo(adjVal(centerX + (halfSize / 2), border, width),      adjVal(centerY + (halfSize / 2), border, height),       adjVal(centerX, border, width),                     adjVal(centerY + (halfSize / 2), border, height),       halfSize / 4);
	ctx.lineTo(adjVal(centerX - (halfSize / 2), border, width),     adjVal(centerY + (halfSize / 2), border, height));
	ctx.lineTo(adjVal(centerX - (halfSize / 2), border, width),     adjVal(centerY + halfSize, border, height));
}

function drawFigureIconPrevious(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// O construction
	setGradient(ctx, null, fillColor.replace(",1)", ",0.5)"), apply);
	ctx.arc(adjVal(centerX, border, width),     adjVal(centerY, border, height),    adjVal(halfSize, border, halfSize),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);

	// < construction
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = 'bold ' + halfSize * 1.25 + 'px fontname';
	setGradient(ctx, null, fillColor, apply);
	ctx.fillText('<', centerX - halfSize / 10, centerY);
	ctx.strokeText('<', centerX - halfSize / 10, centerY);
}

function drawFigureIconNext(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// O construction
	setGradient(ctx, null, fillColor.replace(",1)", ",0.5)"), apply);
	ctx.arc(adjVal(centerX, border, width),     adjVal(centerY, border, height),    adjVal(halfSize, border, halfSize),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);

	// > construction
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = 'bold ' + halfSize * 1.25 + 'px fontname';
	setGradient(ctx, null, fillColor, apply);
	ctx.fillText('>', centerX + halfSize / 10, centerY);
	ctx.strokeText('>', centerX + halfSize / 10, centerY);
}

function drawFigureIconOkey(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// O construction
	setGradient(ctx, null, fillColor.replace(",1)", ",0.5)"), apply);
	ctx.arc(adjVal(centerX, border, width),     adjVal(centerY, border, height),    adjVal(halfSize, border, halfSize),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);

	// V construction
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = 'bold ' + halfSize * 1.0 + 'px fontname';
	setGradient(ctx, null, fillColor, apply);
	ctx.fillText('O', centerX, centerY);
	ctx.strokeText('O', centerX, centerY);
}

function drawFigureIconCancel(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// O construction
	setGradient(ctx, null, fillColor.replace(",1)", ",0.5)"), apply);
	ctx.arc(adjVal(centerX, border, width),     adjVal(centerY, border, height),    adjVal(halfSize, border, halfSize),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);

	// X construction
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = 'bold ' + halfSize * 1.0 + 'px fontname';
	setGradient(ctx, null, fillColor, apply);
	ctx.fillText('Ⅹ', centerX, centerY);
	ctx.strokeText('Ⅹ', centerX, centerY);
}

function drawFigureIconQuestion(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// O construction
	setGradient(ctx, null, fillColor.replace(",1)", ",0.5)"), apply);
	ctx.arc(adjVal(centerX, border, width),     adjVal(centerY, border, height),    adjVal(halfSize, border, halfSize),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);

	// ? construction
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = 'bold ' + halfSize * 1.25 + 'px fontname';
	setGradient(ctx, null, fillColor, apply);
	ctx.fillText('?', centerX, centerY);
	ctx.strokeText('?', centerX, centerY);
}

function drawFigureIconInformation(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var halfSize = Math.min(width, height) / 2;
	var centerX = width / 2;
	var centerY = height / 2;

	// O construction
	setGradient(ctx, null, fillColor.replace(",1)", ",0.5)"), apply);
	ctx.arc(adjVal(centerX, border, width),     adjVal(centerY, border, height),    adjVal(halfSize, border, halfSize),     0,  Math.PI * 2,    false);
	pathCloseAndContinue(ctx, fw, bw);

	// i construction
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = 'bold ' + halfSize * 1.25 + 'px fontname';
	setGradient(ctx, null, fillColor, apply);
	ctx.fillText('i', centerX, centerY);
	ctx.strokeText('i', centerX, centerY);
}

function drawFigurePlus(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;
	var cx = sx + (width / 2);
	var cy = sy + (height / 2);

	var t1 = getCoordValue(aryCoordset, "t1", "0", "40", ex, ey);   // Thickness point : "T1, 0,40, 0,50-50@MIN(100_W:100_H), 0,50"
	var halfThick = Math.min(height * (0.5 - t1.curY), width / 2);

	if (halfThick >= 1) {
		ctx.moveTo(adjVal(cx, border, ex),              adjVal(sy, border, ey));
		ctx.lineTo(adjVal(cx - halfThick, border, ex),  adjVal(sy, border, ey));
		ctx.lineTo(adjVal(cx - halfThick, border, ex),  adjVal(cy - halfThick, border, ey));
		ctx.lineTo(adjVal(sx, border, ex),              adjVal(cy - halfThick, border, ey));
		ctx.lineTo(adjVal(sx, border, ex),              adjVal(cy + halfThick, border, ey));
		ctx.lineTo(adjVal(cx - halfThick, border, ex),  adjVal(cy + halfThick, border, ey));
		ctx.lineTo(adjVal(cx - halfThick, border, ex),  adjVal(ey, border, ey));
		ctx.lineTo(adjVal(cx + halfThick, border, ex),  adjVal(ey, border, ey));
		ctx.lineTo(adjVal(cx + halfThick, border, ex),  adjVal(cy + halfThick, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),              adjVal(cy + halfThick, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),              adjVal(cy - halfThick, border, ey));
		ctx.lineTo(adjVal(cx + halfThick, border, ex),  adjVal(cy - halfThick, border, ey));
		ctx.lineTo(adjVal(cx + halfThick, border, ex),  adjVal(sy, border, ey));
		ctx.lineTo(adjVal(cx, border, ex),              adjVal(sy, border, ey));
	} else {
		ctx.moveTo(adjVal(cx, border, ex),              adjVal(sy, border, ey));
		ctx.lineTo(adjVal(cx, border, ex),              adjVal(cy, border, ey));
		ctx.moveTo(adjVal(sx, border, ex),              adjVal(cy, border, ey));
		ctx.lineTo(adjVal(cx, border, ex),              adjVal(cy, border, ey));
		ctx.moveTo(adjVal(cx, border, ex),              adjVal(ey, border, ey));
		ctx.lineTo(adjVal(cx, border, ex),              adjVal(cy, border, ey));
		ctx.moveTo(adjVal(ex, border, ex),              adjVal(cy, border, ey));
		ctx.lineTo(adjVal(cx, border, ex),              adjVal(cy, border, ey));
		ctx.moveTo(adjVal(sx, border, ex),              adjVal(sy, border, ey)); // Path End.
	}
}

function drawFigureMinus(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var t1 = getCoordValue(aryCoordset, "t1", "0", "40", ex, ey);   // Thickness point : "T1, 0,40, 0,0, 0,50"
	var halfThick = height * (0.5 - t1.curY);

	drawFigureRect(ctx, sx, sy + (height * t1.curY), ex, sy + (height * (1 - t1.curY)), aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply);
}

function drawFigureMultiple(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;
	var cx = sx + (width / 2);
	var cy = sy + (height / 2);

	var t1 = getCoordValue(aryCoordset, "t1", "0", "15", ex, ey);   // Thickness point : "T1, 0,15, 0,0, 0,50@MIN(100_W:100_H)"
	var dy = Math.min(height / 2, height * t1.curY);
	var dx = Math.min(width / 2, dy * (height / width));
	var vx = ((height / 2) - dy) * (width - dx) / (height - dy);
	var vy = ((width / 2) - dx) * (height - dy) / (width - dx);

	if (dy >= 1) {
		ctx.moveTo(adjVal(sx, border, ex),              adjVal(sy + dy, border, ey));
		ctx.lineTo(adjVal(sx + vx, border, ex),         adjVal(cy, border, ey));
		ctx.lineTo(adjVal(sx, border, ex),              adjVal(ey - dy, border, ey));
		ctx.lineTo(adjVal(sx + dx, border, ex),         adjVal(ey, border, ey));
		ctx.lineTo(adjVal(cx, border, ex),              adjVal(ey - vy, border, ey));
		ctx.lineTo(adjVal(ex - dx, border, ex),         adjVal(ey, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),              adjVal(ey - dy, border, ey));
		ctx.lineTo(adjVal(ex - vx, border, ex),         adjVal(cy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),              adjVal(sy + dy, border, ey));
		ctx.lineTo(adjVal(ex - dx, border, ex),         adjVal(sy, border, ey));
		ctx.lineTo(adjVal(cx, border, ex),              adjVal(sy + vy, border, ey));
		ctx.lineTo(adjVal(sx + dx, border, ex),         adjVal(sy, border, ey));
	} else {
		ctx.moveTo(adjVal(sx, border, ex),              adjVal(sy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),              adjVal(ey, border, ey));
		ctx.moveTo(adjVal(sx, border, ex),              adjVal(ey, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),              adjVal(sy, border, ey));
	}
}

function drawFigureDivide(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var t1 = getCoordValue(aryCoordset, "t1", "0", "40", ex, ey);       // Thickness point : "T1, 0,40, 0,I1/2+25, 0,50"
	var i1 = getCoordValue(aryCoordset, "i1", "50", "20", ex, ey);      //interval point : "I1, 50,20, 50,50-T1, 50,T1*2-50"

	var ox = sx + (width / 2);
	var oy = sy + (height * i1.curY);
	var radius = Math.min(Math.max(height * (0.5 - t1.curY), 1), width / 2);
	drawFigureCircle(ctx, ox - radius, oy - radius, ox + radius, oy + radius, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply);
	oy = sy + (height * (1 - i1.curY));
	drawFigureCircle(ctx, ox - radius, oy - radius, ox + radius, oy + radius, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply);
	pathCloseAndContinue(ctx, fw, bw);

	drawFigureRect(ctx, sx, sy + (height * t1.curY), ex, sy + (height * (1 - t1.curY)), aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply);
}

function drawFigureEqual(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var t1 = getCoordValue(aryCoordset, "t1", "0", "25", ex, ey);       // Thickness point : "T1, 0, 25, 0, 0, 0, I1"
	var i1 = getCoordValue(aryCoordset, "i1", "100", "45", ex, ey);     //interval point : "I1, 100, 45, 100, T1, 100, 50"

	drawFigureRect(ctx, sx, sy + (height * t1.curY), ex, sy + (height * i1.curY), aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply);
	pathCloseAndContinue(ctx, fw, bw);
	drawFigureRect(ctx, sx, sy + (height * (1 - i1.curY)), ex, sy + (height * (1 - t1.curY)), aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply);
}

function drawFigureNotequal(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var t1 = getCoordValue(aryCoordset, "t1", "0", "25", ex, ey);       // Thickness point : "T1, 0, 25, 0, 0, 0, I1"
	var i1 = getCoordValue(aryCoordset, "i1", "100", "45", ex, ey);     //interval point : "I1, 100, 45, 100, T1, 100, 50"
	var n1 = getCoordValue(aryCoordset, "n1", "65", "0", ex, ey);       //Diagonal points : "N1, 65,0, 25,0, 75,0"

	var halfWidth  = width  / 2;
	var halfHeight = height  / 2;
	var halfThick  = height * (i1.curY - t1.curY) / 2;
	var inc = halfHeight / ((width * n1.curX) - (width / 2));

	var dxc0 = (halfHeight - 0) / inc;
	var dxc1 = (halfHeight - (height * t1.curY)) / inc;
	var dxc2 = (halfHeight - (height * i1.curY)) / inc;
	var dxc3 = ((height * i1.curY) - halfHeight) / inc;
	var dxc4 = ((height * t1.curY) - halfHeight) / inc;
	var dxc5 = (0 - halfHeight) / inc;

	if (halfThick >= 1) {
		ctx.moveTo(adjVal(sx + halfWidth + dxc0 - halfThick, border, ex),       adjVal(sy, border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc1 - halfThick, border, ex),       adjVal(sy + (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(sx, border, ex),                                      adjVal(sy + (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(sx, border, ex),                                      adjVal(sy + (height * i1.curY), border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc2 - halfThick, border, ex),       adjVal(sy + (height * i1.curY), border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc3 - halfThick, border, ex),       adjVal(ey - (height * i1.curY), border, ey));
		ctx.lineTo(adjVal(sx, border, ex),                                      adjVal(ey - (height * i1.curY), border, ey));
		ctx.lineTo(adjVal(sx, border, ex),                                      adjVal(ey - (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc4 - halfThick, border, ex),       adjVal(ey - (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc5 - halfThick, border, ex),       adjVal(ey, border, ey));

		ctx.lineTo(adjVal(sx + halfWidth + dxc5 + halfThick, border, ex),       adjVal(ey, border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc4 + halfThick, border, ex),       adjVal(ey - (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(ex, border, ex),                                      adjVal(ey - (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(ex, border, ex),                                      adjVal(ey - (height * i1.curY), border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc3 + halfThick, border, ex),       adjVal(ey - (height * i1.curY), border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc2 + halfThick, border, ex),       adjVal(sy + (height * i1.curY), border, ey));
		ctx.lineTo(adjVal(ex, border, ex),                                      adjVal(sy + (height * i1.curY), border, ey));
		ctx.lineTo(adjVal(ex, border, ex),                                      adjVal(sy + (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc1 + halfThick, border, ex),       adjVal(sy + (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(sx + halfWidth + dxc0 + halfThick, border, ex),       adjVal(sy, border, ey));
		pathCloseAndContinue(ctx, fw, bw);

		// Drawing complement (= overlap)
		if (adjVal(sy + (height * i1.curY), border, ey) == adjVal(ey - (height * i1.curY), border, ey)) {
			ctx.moveTo(adjVal(sx, border, ex),                                  adjVal(sy + (height * i1.curY), border, ey));
			ctx.lineTo(adjVal(sx + halfWidth + dxc2 - halfThick, border, ex),   adjVal(sy + (height * i1.curY), border, ey));
			ctx.moveTo(adjVal(ex, border, ex),                                  adjVal(ey - (height * i1.curY), border, ey));
			ctx.lineTo(adjVal(sx + halfWidth + dxc3 + halfThick, border, ex),   adjVal(ey - (height * i1.curY), border, ey));
		}
	} else {
		ctx.moveTo(adjVal(sx, border, ex),                                      adjVal(sy + (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(ex, border, ex),                                      adjVal(sy + (height * t1.curY), border, ey));
		ctx.moveTo(adjVal(sx, border, ex),                                      adjVal(ey - (height * t1.curY), border, ey));
		ctx.lineTo(adjVal(ex, border, ex),                                      adjVal(ey - (height * t1.curY), border, ey));
		ctx.moveTo(adjVal(sx + (width * n1.curX), border, ex),                  adjVal(sy, border, ey));
		ctx.lineTo(adjVal(ex - (width * n1.curX), border, ex),                  adjVal(ey, border, ey));
	}
}

function drawFigureUnder(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;
	var cx = sx + (width / 2);
	var cy = sy + (height / 2);

	var t1 = getCoordValue(aryCoordset, "t1", "100", "15", ex, ey);   // Thickness point : "T1, 100,15, 100,0, 100,50@MIN(100_W:100_H)"
	var dy = Math.min(height / 2, height * t1.curY);
	var dx = Math.min(width / 2, dy * (height / width));
	var vx = ((height / 2) - dy) * (width - dx) / (height / 2);
	var vy = ((width / 2) - dx) * (height - dy) / (width / 2);

	if (dy >= 1) {
		ctx.moveTo(adjVal(ex, border, ex),          adjVal(sy + dy, border, ey));
		ctx.lineTo(adjVal(ex - vx, border, ex),     adjVal(cy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),          adjVal(ey - dy, border, ey));
		ctx.lineTo(adjVal(ex - dx, border, ex),     adjVal(ey, border, ey));
		ctx.lineTo(adjVal(sx, border, ex),          adjVal(cy, border, ey));
		ctx.lineTo(adjVal(ex - dx, border, ex),     adjVal(sy, border, ey));
	} else {
		ctx.moveTo(adjVal(ex, border, ex),          adjVal(sy, border, ey));
		ctx.lineTo(adjVal(sx, border, ex),          adjVal(cy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),          adjVal(ey, border, ey));
		pathStrokeAndContinue(ctx, fw, bw);
	}
}

function drawFigureOver(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;
	var cx = sx + (width / 2);
	var cy = sy + (height / 2);

	var t1 = getCoordValue(aryCoordset, "t1", "0", "15", ex, ey);   // Thickness point : "T1, 0,15, 0,0, 0,50@MIN(100_W:100_H)"
	var dy = Math.min(height / 2, height * t1.curY);
	var dx = Math.min(width / 2, dy * (height / width));
	var vx = ((height / 2) - dy) * (width - dx) / (height / 2);
	var vy = ((width / 2) - dx) * (height - dy) / (width / 2);

	if (dy >= 1) {
		ctx.moveTo(adjVal(sx, border, ex),          adjVal(sy + dy, border, ey));
		ctx.lineTo(adjVal(sx + vx, border, ex),     adjVal(cy, border, ey));
		ctx.lineTo(adjVal(sx, border, ex),          adjVal(ey - dy, border, ey));
		ctx.lineTo(adjVal(sx + dx, border, ex),     adjVal(ey, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),          adjVal(cy, border, ey));
		ctx.lineTo(adjVal(sx + dx, border, ex),     adjVal(sy, border, ey));
	} else {
		ctx.moveTo(adjVal(sx, border, ex),          adjVal(sy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),          adjVal(cy, border, ey));
		ctx.lineTo(adjVal(sx, border, ex),          adjVal(ey, border, ey));
		pathStrokeAndContinue(ctx, fw, bw);
	}
}

function drawFigureProcess(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	// [] construction
	ctx.moveTo(adjVal(sx + (width / 2), border, ex),    adjVal(sy, border, ey));
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(sy, border, ey),             adjVal(sx, border, ex),                 adjVal(sy + (height / 2), border, ey),  0);
	ctx.arcTo(adjVal(sx, border, ex),                   adjVal(ey, border, ey),             adjVal(sx + (width / 2), border, ex),   adjVal(ey, border, ey),                 0);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(ey, border, ey),             adjVal(ex, border, ex),                 adjVal(sy + (height / 2), border, ey),  0);
	ctx.arcTo(adjVal(ex, border, ex),                   adjVal(sy, border, ey),             adjVal(sx + (width / 2), border, ex),   adjVal(sy, border, ey),                 0);

	// Drawing complement (= overlap)
	if (height < border) {
		ctx.moveTo(adjVal(sx, border, ex),              adjVal(sy, border, ey));
		ctx.lineTo(adjVal(ex, border, ex),              adjVal(sy, border, ey));
	}
}

function drawFigureAlternateProcess(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var f1 = getCoordValue(aryCoordset, "f1", "10", "0", width, height);    //Inflection point : "F1, 10,0, 0,0, 50@MIN(100_W:100_H),0"
	var radius = Math.min(Math.min(width / 2, height / 2), width * f1.curX);
	
	// () construction
	ctx.moveTo(adjVal(width / 2, border, width),    adjVal(0, border, height));
	ctx.arcTo(adjVal(0, border, width),             adjVal(0, border, height),          adjVal(0, border, width),               adjVal(height / 2, border, height),     radius);
	ctx.arcTo(adjVal(0, border, width),             adjVal(height, border, height),     adjVal(width / 2, border, width),       adjVal(height, border, height),         radius);
	ctx.arcTo(adjVal(width, border, width),         adjVal(height, border, height),     adjVal(width, border, width),           adjVal(height / 2, border, height),     radius);
	ctx.arcTo(adjVal(width, border, width),         adjVal(0, border, height),          adjVal(width / 2, border, width),       adjVal(0, border, height),              radius);
}

function drawFigureDecision(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	// <> construction
	ctx.moveTo(adjVal(width / 2, border, width),    adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),            adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width / 2, border, width),    adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),        adjVal(height / 2, border, height));
}

function drawFigureData(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var v1 = getCoordValue(aryCoordset, "v1", "25", "0", width, height);    //vertex : "V1, 25,0, 0,0, 50,0"

	// /_| construction
	ctx.moveTo(adjVal(width * v1.curX, border, width),          adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(height, border, height));
	ctx.lineTo(adjVal(width * (1 - v1.curX), border, width),    adjVal(0, border, height));
}

function drawFigurePredefinedProcess(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;
	
	var l1 = getCoordValue(aryCoordset, "l1", "25", "0", width, height);  
	var r1 = getCoordValue(aryCoordset, "r1", "75", "0", width, height);  
	
	// [] construction
	ctx.moveTo(adjVal(sx, border, width),		adjVal(sy, border, height));
	ctx.lineTo(adjVal(width * l1.curX, border, width),		adjVal(sy, border, height));
	ctx.lineTo(adjVal(width * l1.curX, border, width),		adjVal(ey, border, height));
	ctx.lineTo(adjVal(sx, border, width),		adjVal(ey, border, height));
	
	pathCloseAndContinue(ctx, fw, bw);
	
	ctx.moveTo(adjVal(width * l1.curX, border, width),		adjVal(sy, border, height));
	ctx.lineTo(adjVal(width * r1.curX, border, width),		adjVal(sy, border, height));
	ctx.lineTo(adjVal(width * r1.curX, border, width),		adjVal(ey, border, height));
	ctx.lineTo(adjVal(width * l1.curX, border, width),		adjVal(ey, border, height));
	
	pathCloseAndContinue(ctx, fw, bw);
	
	ctx.moveTo(adjVal(width * r1.curX, border, width),		adjVal(sy, border, height));
	ctx.lineTo(adjVal(ex, border, width),		adjVal(sy, border, height));
	ctx.lineTo(adjVal(ex, border, width),		adjVal(ey, border, height));
	ctx.lineTo(adjVal(width * r1.curX, border, width),		adjVal(ey, border, height));

}

function drawFigureInputorOutput(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) { //Parallelogram
	var v1 = getCoordValue(aryCoordset, "v1", "25", "0", width, height);    //vertex : "V1, 25,0, 0,0, 100,0"

	// /_/ construction
	ctx.moveTo(adjVal(width * v1.curX, border, width),          adjVal(0, border, height));
	ctx.lineTo(adjVal(0, border, width),                        adjVal(height, border, height));
	ctx.lineTo(adjVal(width * (1 - v1.curX), border, width),    adjVal(height, border, height));
	ctx.lineTo(adjVal(width, border, width),                    adjVal(0, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing supplement (// nested)
	if (same_x(0, 1 - v1.curX, border, width)) {
		ctx.moveTo(adjVal(0, border, width),                    adjVal(height, border, height));
		ctx.lineTo(adjVal(width, border, width),                adjVal(0, border, height));
	}
	ctx.moveTo(adjVal(0, border, width),                        adjVal(0, border, height)); // Path End.
}

function drawFigureInternalStorage(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;
	
	var l1 = getCoordValue(aryCoordset, "l1", "25", "0", width, height);  
	var t1 = getCoordValue(aryCoordset, "t1", "0", "25", width, height);  
	
	// [] construction
	ctx.moveTo(adjVal(sx, border, width),		adjVal(sy, border, height));
	ctx.lineTo(adjVal(width, border, width),		adjVal(sy, border, height));
	ctx.lineTo(adjVal(width, border, width),		adjVal(ey, border, height));
	ctx.lineTo(adjVal(sx, border, width),		adjVal(ey, border, height));
	
	pathCloseAndContinue(ctx, fw, bw);
	
	ctx.moveTo(adjVal(width * l1.curX, border, width),		adjVal(sy, border, height));
	ctx.lineTo(adjVal(width * l1.curX, border, width),		adjVal(ey, border, height));
	
	pathCloseAndContinue(ctx, fw, bw);
	
	ctx.moveTo(adjVal(sx, border, width),		adjVal(height * t1.curY, border, height));
	ctx.lineTo(adjVal(ex, border, width),		adjVal(height * t1.curY, border, height));

}

function drawFigureDocument(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var f1 = getCoordValue(aryCoordset, "f1", "0", "10", ex, ey);               //Inflection point : "F1, 0,10, 0,0, 0,25"

	var unitWidth = width / 8;
	var unitHeight = height * f1.curY;

	ctx.moveTo(adjVal(sx, border, ex),		adjVal(sy, border, ey));
	ctx.lineTo(adjVal(ex, border, ex),		adjVal(sy, border, ey));
	ctx.lineTo(adjVal(ex, border, ex),                              adjVal(ey - (unitHeight * 2), border, ey));
	
	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 7), border, ex),  adjVal(ey - (unitHeight * 2), border, ey),                         adjVal(sx + (unitWidth * 6), border, ex),   adjVal(ey - (unitHeight * 2), border, ey));
	ctx.bezierCurveTo(adjVal(sx + (unitWidth * 5), border, ex),     adjVal(ey - (unitHeight * 2), border, ey),                         adjVal(sx + (unitWidth * 3), border, ex),   adjVal(ey, border, ey),      adjVal(sx + (unitWidth * 2), border, ex),   adjVal(ey, border, ey));
	ctx.quadraticCurveTo(adjVal(sx + unitWidth, border, ex),        adjVal(ey, border, ey),      adjVal(sx, border, ex),                     adjVal(ey, border, ey));
}

function drawFigureDelay(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width / 8;;

	ctx.moveTo(adjVal(sx, border, ex),		adjVal(sy, border, ey));
	ctx.lineTo(adjVal(sx + (unitWidth * 6), border, ex), adjVal(sy, border, ey));
	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 8), border, ex),  adjVal(sy, border, ey), adjVal(ex, border, ex),   adjVal(ey/2, border, ey));  
	ctx.quadraticCurveTo(adjVal(sx + (unitWidth * 8), border, ex), adjVal(ey, border, ey),  adjVal(sx + (unitWidth * 6), border, ex), adjVal(ey, border, ey));
	ctx.lineTo(adjVal(sx, border, ex), adjVal(ey, border, ey));
}

function drawFigureOffPageConnector(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {

	ctx.moveTo(adjVal(0, border, width),		adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width), adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width), adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width / 2, border, width), adjVal(height, border, height));
	ctx.lineTo(adjVal(0, border, width), adjVal(height / 2, border, height));
}

function drawFigureManualInput(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {

	ctx.moveTo(adjVal(0, border, width),		adjVal(height / 2, border, height));
	ctx.lineTo(adjVal(width, border, width), adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width), adjVal(height, border, height));
	ctx.lineTo(adjVal(0, border, width), adjVal(height, border, height));
}

function drawFigureManualOperation(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	ctx.moveTo(adjVal(0, border, width),		adjVal(0, border, height));
	ctx.lineTo(adjVal(width, border, width), adjVal(0, border, height));
	ctx.lineTo(adjVal(width * 0.8, border, width), adjVal(height, border, height));
	ctx.lineTo(adjVal(width * 0.2, border, width), adjVal(height, border, height));
}

function drawFigureStoredData(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	ctx.moveTo(			adjVal(width * 0.2, border, ex),			adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(ex, border, ex), 					adjVal(sy, border, ey));
	ctx.quadraticCurveTo(	adjVal(width * 0.8, border, ex), 			adjVal(sy, border, ey), 		adjVal(width * 0.8, border, ex),   	adjVal(ey/2, border, ey));  
	ctx.quadraticCurveTo(	adjVal(width * 0.8, border, ex), 			adjVal(ey, border, ey), 		adjVal(ex, border, ex),   			adjVal(ey, border, ey));  
	ctx.lineTo(			adjVal(width * 0.2, border, ex),			adjVal(ey, border, ey));
	ctx.quadraticCurveTo(	adjVal(sx , border, ex), 					adjVal(ey, border, ey),  		adjVal(sx, border, ex), 			adjVal(ey/2, border, ey));
	ctx.quadraticCurveTo(	adjVal(sx, border, ex), 					adjVal(sy, border, ey),  		adjVal(width * 0.2, border, ex), 	adjVal(sy, border, ey));
}

function drawFigureDataBase(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var h1 = getCoordValue(aryCoordset, "h1", "0", "15", width, height);    //Height point : "H1, 0,15, 0,0, 0,50"
	var adjBezier = height * h1.curY / 3 - (parseInt(border / 3) + 1);

	// Top circles drawn
	setDrawColor(ctx, border, borderColor, fillColor, 'light', apply);
	ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(0, border, width),     0 - adjBezier,                              adjVal(width, border, width),   0 - adjBezier,                      adjVal(width, border, width),   adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing cylindrical
	setDrawColor(ctx, border, borderColor, fillColor, 'normal', apply);
	ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
	ctx.lineTo(adjVal(0, border, width),            adjVal(height * (1 - h1.curY), border, height));
	ctx.bezierCurveTo(adjVal(0, border, width),     height + adjBezier,                         adjVal(width, border, width),   height + adjBezier,                 adjVal(width, border, width),   adjVal(height * (1 - h1.curY), border, height));
	ctx.lineTo(adjVal(width, border, width),        adjVal(height * h1.curY, border, height));
	ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
	pathCloseAndContinue(ctx, fw, bw);

	// Drawing Border
	if (borderColor != fillColor) {
		setDrawColor(ctx, border, borderColor, fillColor, 'null', apply);
		// Drawing the top border
		ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
		ctx.bezierCurveTo(adjVal(0, border, width),     0 - adjBezier,                              adjVal(width, border, width),   0 - adjBezier,                      adjVal(width, border, width),   adjVal(height * h1.curY, border, height));
		ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
		// Drawing cylindrical rim
		ctx.moveTo(adjVal(0, border, width),            adjVal(height * h1.curY, border, height));
		ctx.lineTo(adjVal(0, border, width),            adjVal(height * (1 - h1.curY), border, height));
		ctx.bezierCurveTo(adjVal(0, border, width),     height + adjBezier,                         adjVal(width, border, width),   height + adjBezier,                 adjVal(width, border, width),   adjVal(height * (1 - h1.curY), border, height));
		ctx.lineTo(adjVal(width, border, width),        adjVal(height * h1.curY, border, height));
		ctx.bezierCurveTo(adjVal(width, border, width), height * h1.curY * 2 + adjBezier,           adjVal(0, border, width),       height * h1.curY * 2 + adjBezier,   adjVal(0, border, width),       adjVal(height * h1.curY, border, height));
	}
}

function drawFigureMagneticTape(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;

	ctx.moveTo(			adjVal(sx + (unitWidth * 4), border, ex),	adjVal(sy, border, ey));
	ctx.quadraticCurveTo(	adjVal(sx + (unitWidth * 8), border, ex), 	adjVal(sy, border, ey), 		
						adjVal(sx + (unitWidth * 8), border, ex),   	adjVal(sy + (unitHeight * 4), border, ey));  
	ctx.quadraticCurveTo(	adjVal(sx + (unitWidth * 8) , border, ex), 	adjVal(sy + (unitHeight * 7), border, ey),  
						adjVal(sx + (unitWidth * 6) , border, ex), 	adjVal(sy + (unitHeight * 7), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 8), border, ex),	adjVal(sy + (unitHeight * 7), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 8), border, ex),	adjVal(sy + (unitHeight * 8), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 4), border, ex),	adjVal(sy + (unitHeight * 8), border, ey));
	ctx.quadraticCurveTo(	adjVal(sx, border, ex), 					adjVal(sy + (unitHeight * 8), border, ey),  
						adjVal(sx, border, ex), 					adjVal(sy + (unitHeight * 4), border, ey));
	ctx.quadraticCurveTo(	adjVal(sx, border, ex), 					adjVal(sy, border, ey),  
						adjVal(sx + (unitWidth * 4) , border, ex), 	adjVal(sy, border, ey));
}

function drawFigureOfflineStorage(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;
	
	ctx.moveTo(			adjVal(sx, border, ex),					adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 8), border, ex),	adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 7), border, ex),	adjVal(sy + (unitHeight * 2), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 6), border, ex),	adjVal(sy + (unitHeight * 4), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 5), border, ex),	adjVal(sy + (unitHeight * 6), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 4), border, ex),	adjVal(sy + (unitHeight * 8), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 3), border, ex),	adjVal(sy + (unitHeight * 6), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 2), border, ex),	adjVal(sy + (unitHeight * 4), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 1), border, ex),	adjVal(sy + (unitHeight * 2), border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),					adjVal(sy, border, ey));
	pathCloseAndContinue(ctx, fw, bw);
	
	ctx.moveTo(			adjVal(sx + (unitWidth * 2), border, ex),	adjVal(sy + (unitHeight * 4), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 6), border, ex),	adjVal(sy + (unitHeight * 4), border, ey));
}

function drawFigureDisplay(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;
	
	ctx.moveTo(			adjVal(sx, border, ex),					adjVal(sy + (unitHeight * 4), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 1.5), border, ex),	adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 6.5), border, ex),	adjVal(sy, border, ey));
	ctx.quadraticCurveTo(	adjVal(sx + (unitWidth * 8), border, ex), 	adjVal(sy, border, ey), 		
						adjVal(sx + (unitWidth * 8), border, ex),   	adjVal(sy + (unitHeight * 4), border, ey));  
	ctx.quadraticCurveTo(	adjVal(sx + (unitWidth * 8), border, ex), 	adjVal(sy + (unitHeight * 8), border, ey), 		
						adjVal(sx + (unitWidth * 6.5), border, ex),   	adjVal(sy + (unitHeight * 8), border, ey));  
	ctx.lineTo(			adjVal(sx + (unitWidth * 1.5), border, ex),	adjVal(sy + (unitHeight * 8), border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),					adjVal(sy + (unitHeight * 4), border, ey));
}

function drawFigurePreparation(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;
	
	ctx.moveTo(			adjVal(sx, border, ex),					adjVal(sy + (unitHeight * 4), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 1.5), border, ex),	adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 6.5), border, ex),	adjVal(sy, border, ey));  
	ctx.lineTo(			adjVal(sx + (unitWidth * 8), border, ex),	adjVal(sy + (unitHeight * 4), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 6.5), border, ex),	adjVal(sy + (unitHeight * 8), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 1.5), border, ex),	adjVal(sy + (unitHeight * 8), border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),					adjVal(sy + (unitHeight * 4), border, ey));
}

function drawFigurePunchedCard(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;
	
	ctx.moveTo(			adjVal(sx, border, ex),					adjVal(sy + (unitHeight * 1.5), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 1.5), border, ex),	adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 8), border, ex),	adjVal(sy, border, ey));  
	ctx.lineTo(			adjVal(sx + (unitWidth * 8), border, ex),	adjVal(sy + (unitHeight * 8), border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),					adjVal(sy + (unitHeight * 8), border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),					adjVal(sy + (unitHeight * 1.5), border, ey));
}

function drawFigurePunchedTape(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;
	
	ctx.moveTo(			adjVal(sx, border, ex),                    	adjVal(sy + unitHeight, border, ey));
	ctx.quadraticCurveTo(	adjVal(sx, border, ex),        			adjVal(sy + (unitHeight * 2), border, ey),                         
						adjVal(sx + (unitWidth * 2), border, ex),  	adjVal(sy + (unitHeight * 2), border, ey));
	ctx.bezierCurveTo(	adjVal(sx + (unitWidth * 4), border, ex),  	adjVal(sy + (unitHeight * 2), border, ey),
						adjVal(sx + (unitWidth * 5), border, ex),  	adjVal(sy, border, ey),
						adjVal(sx + (unitWidth * 6), border, ex),	adjVal(sy, border, ey));
	ctx.quadraticCurveTo(	adjVal(sx + (unitWidth * 8	), border, ex),	adjVal(sy, border, ey),
						adjVal(ex, border, ex),                    	adjVal(sy + unitHeight, border, ey));
	ctx.lineTo(			adjVal(ex, border, ex),                    	adjVal(ey - unitHeight, border, ey));
	ctx.quadraticCurveTo(	adjVal(sx + (unitWidth * 7), border, ex),  	adjVal(ey - (unitHeight * 2), border, ey),
						adjVal(sx + (unitWidth * 6), border, ex),  	adjVal(ey - (unitHeight * 2), border, ey));
	ctx.bezierCurveTo(	adjVal(sx + (unitWidth * 5), border, ex),  	adjVal(ey - (unitHeight * 2), border, ey),
						adjVal(sx + (unitWidth * 3), border, ex),  	adjVal(ey, border, ey),
						adjVal(sx + (unitWidth * 2), border, ex),  	adjVal(ey, border, ey));
	ctx.quadraticCurveTo(	adjVal(sx + unitWidth, border, ex),        	adjVal(ey, border, ey),
						adjVal(sx, border, ex),                    	adjVal(ey - unitHeight, border, ey));
}

function drawFigureKeying(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;
	
	ctx.moveTo(			adjVal(sx + unitWidth, border, ex),			adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(ex - unitWidth, border, ex),			adjVal(sy, border, ey));
	ctx.quadraticCurveTo(	adjVal(ex, border, ex),        			adjVal(sy, border, ey),                         
						adjVal(ex, border, ex),  					adjVal(sy + (unitHeight * 4), border, ey));
	ctx.quadraticCurveTo(	adjVal(ex, border, ex),					adjVal(ey, border, ey),
						adjVal(ex - unitWidth, border, ex),         	adjVal(ey, border, ey));
	ctx.lineTo(			adjVal(sx + unitWidth, border, ex),			adjVal(ey, border, ey));
	ctx.quadraticCurveTo(	adjVal(sx, border, ex),  					adjVal(ey, border, ey),
						adjVal(sx, border, ex),  					adjVal(ey - (unitHeight * 4), border, ey));
	ctx.quadraticCurveTo(	adjVal(sx, border, ex),        			adjVal(sy, border, ey),
						adjVal(sx + unitWidth, border, ex),         	adjVal(sy, border, ey));
}

function drawFigureSort(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;

	ctx.moveTo(			adjVal(sx + (unitWidth * 4), border, ex),			adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(ex, border, ex),							adjVal(sy + (unitHeight * 4), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 4), border, ex),			adjVal(ey, border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),							adjVal(sy + (unitHeight * 4), border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 4), border, ex),			adjVal(sy, border, ey));
	pathCloseAndContinue(ctx, fw, bw);
	
	ctx.moveTo(			adjVal(sx, border, ex),			adjVal(sy + (unitHeight * 4), border, ey));
	ctx.lineTo(			adjVal(ex, border, ex),			adjVal(sy + (unitHeight * 4), border, ey));
}

function drawFigureMergeStroage(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;

	ctx.moveTo(			adjVal(sx, border, ex),			adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(ex, border, ex),							adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 4), border, ex),			adjVal(ey, border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),							adjVal(sy, border, ey));
}

function drawFigureExtract(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;

	ctx.moveTo(			adjVal(sx + (unitWidth * 4), border, ex),			adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(ex, border, ex),							adjVal(ey, border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),							adjVal(ey, border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 4), border, ex),			adjVal(sy, border, ey));
}

function drawFigureCollate(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;

	ctx.moveTo(			adjVal(sx, border, ex),							adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(ex, border, ex),							adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),							adjVal(ey, border, ey));
	ctx.lineTo(			adjVal(ex, border, ex),							adjVal(ey, border, ey));
	ctx.lineTo(			adjVal(sx, border, ex),							adjVal(sy, border, ey));
}

function drawFigureSummingJunction(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var radius;
	if(width > height)
		radius = height / 2.1;
	else 
		radius = width / 2.1;
	
	ctx.arc(width/2, height/2, radius, 0, (Math.PI/180)*360, true);
	pathCloseAndContinue(ctx, fw, bw);
	
	ctx.moveTo(		adjVal(width/2, border, width), 	adjVal(height/2, border, height));
	ctx.arc(		width/2, height/2, radius, (Math.PI/180)*45, (Math.PI/180)*135, true);
	pathStrokeAndContinue(ctx, fw, bw);
	
	ctx.moveTo(		adjVal(width/2, border, width), 	adjVal(height/2, border, height));
	ctx.arc(		width/2, height/2, radius, (Math.PI/180)*135, (Math.PI/180)*225, true);
	pathStrokeAndContinue(ctx, fw, bw);
	
	ctx.moveTo(		adjVal(width/2, border, width), 	adjVal(height/2, border, height));
	ctx.arc(		width/2, height/2, radius, (Math.PI/180)*225, (Math.PI/180)*315, true);
	pathStrokeAndContinue(ctx, fw, bw);
	
	ctx.moveTo(		adjVal(width/2, border, width), 	adjVal(height/2, border, height));
	ctx.arc(		width/2, height/2, radius, (Math.PI/180)*315, (Math.PI/180)*405, true);
	pathStrokeAndContinue(ctx, fw, bw);
}

function drawFigureLogicalOr(ctx, sx, sy, ex, ey, aryCoordset, border, dash, borderColor, fillColor, fw, bw, apply) {
	var width = ex - sx;
	var height = ey - sy;

	var unitWidth = width/8;
	var unitHeight = height /8;
	
	var radius;
	if(width > height)
		radius = height / 2.1;
	else 
		radius = width / 2.1;
	
	ctx.arc(width/2, height/2, radius, 0, (Math.PI/180)*360, true);
	pathCloseAndContinue(ctx, fw, bw);
	
	ctx.moveTo(			adjVal(sx + (unitWidth * 4), border, ex), 			adjVal(sy, border, ey));
	ctx.lineTo(			adjVal(sx + (unitWidth * 4), border, ex),			adjVal(ey, border, ey));
	pathStrokeAndContinue(ctx, fw, bw);
	
	ctx.moveTo(			adjVal(sx, border, ex), 			adjVal(sy + (unitWidth * 4), border, ey));
	ctx.lineTo(			adjVal(ex, border, ex),			adjVal(sy + (unitWidth * 4), border, ey));
}

// Line Drawing Shapes ====================================================================================
function lineDraw(cv, borderType, arrowType, borderWidth, borderColor, dashType) {
    var aryCoordset = null;
    var strCoordset = cv.getAttribute("data-pubtreediagramcoords");
    if (strCoordset != null) {
        aryCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
    }
    borderType = borderType.replace(/ /g, '').toLowerCase();
    arrowType = arrowType.replace(/ /g, '').toLowerCase();

	var ctx = cv.getContext('2d');
    var border = eval(borderWidth);
    var width = cv.width;   //cv.clientWidth - cv.clientLeft - cv.style.paddingLeft.replace(/[^-\.0-9]/g, '') - cv.style.paddingRight.replace(/[^-\.0-9]/g, ''); //cv.style.width.replace(/[^-\.0-9]/g, '');
    var height = cv.height; //cv.clientHeight - cv.clientTop - cv.style.paddingTop.replace(/[^-\.0-9]/g, '') - cv.style.paddingBottom.replace(/[^-\.0-9]/g, ''); //cv.style.height.replace(/[^-\.0-9]/g, '');
    ctx.clearRect(0, 0, width, height); //canvas clear

	var dash = eval(dashType);
	var fw = border; var bw = 0;
	switch (dash) {
	    case 1:
	    case 2:
	    case 3:
	        fw = border * dash;
	        bw = border;
	        break;
	}

	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = borderColor;
	ctx.fillStyle = borderColor;
	ctx.lineWidth = border;

	var shapeType = borderType + arrowType;
	switch (shapeType) {
	    case 'linenone':                drawLineNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                         break;
	    case 'linesingle':              drawLineSingleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                       break;
	    case 'linedouble':              drawLineDoubleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                       break;
	    case 'turnnone':                drawLineTurnNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                     break;
	    case 'turnsingle':              drawLineTurnSingleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                   break;
	    case 'turndouble':              drawLineTurnDoubleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                   break;
	    case '2turnnone':               drawLine2TurnNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                    break;
	    case '2turnsingle':             drawLine2TurnSingleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                  break;
	    case '2turndouble':             drawLine2TurnDoubleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                  break;
	    case 'undernone':               drawLineUnderNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                    break;
	    case 'overnone':                drawLineOverNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                     break;
	    case 'bezier1none':             drawLineBezier1NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                  break;
	    case 'bezier2none':             drawLineBezier2NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                  break;
	    case 'parabolanone':            drawLineParabolaNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                 break;
	    //Parentheses collection 
	    case 'openparenthesisnone':     drawLineOpenparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);    break;
	    case 'closeparenthesisnone':    drawLineCloseparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);   break;
	    case 'doubleparenthesisnone':   drawLineDoubleparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);  break;
	    case 'openbracenone':           drawLineOpenbraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);          break;
	    case 'closebracenone':          drawLineClosebraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);         break;
	    case 'doublebracenone':         drawLineDoublebraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);        break;
	    case 'openbracketnone':         drawLineOpenbracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);        break;
	    case 'closebracketnone':        drawLineClosebracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);       break;
	    case 'doublebracketnone':       drawLineDoublebracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);      break;
	    //Coordinate, grid 
	    case 'coordinatenone':          drawLineCoordinateNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);         break;
	    case 'gridnone':                drawLineGridNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);               break;
	}

	ctx.mozDash = [fw, bw];
	if (!ctx.setLineDash) {
		ctx.setLineDash = function () {}
	} else {
		ctx.setLineDash([fw,bw]);//safari "undefined function"
	}
	ctx.stroke();
	ctx.restore();
}

// Drawing gradient ====================================================================================
function setGradient(ctx, defStartColor, defEndColor, apply) {

	var width = ctx.canvas.width;   //ctx.canvas.clientWidth - ctx.canvas.clientLeft - ctx.canvas.style.paddingLeft.replace(/[^-\.0-9]/g, '') - ctx.canvas.style.paddingRight.replace(/[^-\.0-9]/g, ''); //ctx.canvas.style.width.replace(/[^-\.0-9]/g, '');
	var height = ctx.canvas.height; //ctx.canvas.clientHeight - ctx.canvas.clientTop - ctx.canvas.style.paddingTop.replace(/[^-\.0-9]/g, '') - ctx.canvas.style.paddingBottom.replace(/[^-\.0-9]/g, ''); //ctx.canvas.style.height.replace(/[^-\.0-9]/g, '');

	var aryGradient = null;
	var strGradient = ctx.canvas.getAttribute("data-pubtreediagramgradient");
	if (strGradient != null) {
		aryGradient = new String(strGradient.replace(/ /g, '').toLowerCase()).split(";");
	}
	if (aryGradient == null) {
		if (defStartColor != null)
			ctx.fillStyle = (apply == true) ? defStartColor : defStartColor.replace(",1)", ",0.5)");
		else if (defEndColor != null)
			ctx.fillStyle = (apply == true) ? defEndColor : defEndColor.replace(",1)", ",0.5)");
		return;
	}

	var sx = sy = 0;
	var ex = sx + width;
	var ey = sy + height;
	var cx = sx + (width / 2);
	var cy = sy + (height / 2);
	var gType = 'l';
	var gOrg = 'lt';
	var gColors = [];
	gColors[0] = {}; gColors[0].pos = 0; gColors[0].val = (defStartColor != null) ? defStartColor : 'rgba(255,255,255,1)';
	gColors[1] = {}; gColors[1].pos = 1; gColors[1].val = (defEndColor != null) ? defEndColor : 'rgba(0,0,0,1)';

	for (getidx = putidx = 0; getidx < aryGradient.length; getidx++) {
		switch (getidx) {
			case 0:
				if (aryGradient[getidx].length == 3) {
					gType = aryGradient[getidx][0];
					gOrg  = aryGradient[getidx][1];
					gOrg += aryGradient[getidx][2];
				}
				break;

			default:
				if (aryGradient[getidx].length) {
					var arrInfo = aryGradient[getidx].split("%");
					if (arrInfo != null) {
						gColors[putidx] = {};
						gColors[putidx].pos = -1;
						if (arrInfo.length >= 2) {
							gColors[putidx].pos = eval(arrInfo[0]) / 100;
							arrInfo.splice(0, 1);
						}
						// Reserved word processing
						switch (arrInfo[0]) {
							case 'null':    gColors[putidx].val = (putidx != 0) ? getDrawColor(gColors[putidx - 1].val, 'transparency') : 'rgba(255,255,255,0)'; break;
							case 'fill':    gColors[putidx].val = (defEndColor != null) ? defEndColor : 'rgba(0,0,0,1)'; break;
							case 'random':  gColors[putidx].val = getDrawColor('rgba(255,255,255,1)', 'random'); break;
							default:        gColors[putidx].val = arrInfo[0]; break;
						}
						putidx++;
					}
				}
				break;
		}
	}

	// Adjust location
	for (loop = 0, sidx = eidx = -1; loop < gColors.length; loop++) {
		if (gColors[loop].pos == -1) {
			if (loop == 0)
				gColors[loop--].pos = 0;
			else if (loop == gColors.length - 1)
				gColors[loop--].pos = 1;
			else {
				eidx = loop;
				if (sidx == -1)
					sidx = loop;
			}
		} else if (sidx != -1 && eidx != -1) {
			var ival = (gColors[eidx + 1].pos - gColors[sidx - 1].pos) / (eidx - sidx + 2);
			for (; sidx <= eidx; sidx++) {
				gColors[sidx].pos = gColors[sidx - 1].pos + ival;
			}
			sidx = eidx = -1;
		}
	}

	// For a virtual construct adjustment alpha
	if (apply == false) {
		for (loop = 0; loop < gColors.length; loop++) {
			gColors[loop].val = gColors[loop].val.replace(",1)", ",0.5)");   //alpha;
		}
	}

	var grd = null;
	var x0 = y0 = r0 = x1 = y1 = r1 = 0;
	switch (gType) {
		case 'l':   // LinearGradient
			switch (gOrg) {
				case 'lt':
				case 'tl':  x0 = sx; y0 = sy; x1 = ex; y1 = ey; break;
				case 'tc':
				case 'tm':  x0 = cx; y0 = sy; x1 = cx; y1 = ey; break;
				case 'rt':
				case 'tr':  x0 = ex; y0 = sy; x1 = sx; y1 = ey; break;
				case 'lc':
				case 'lm':  x0 = sx; y0 = cy; x1 = ex; y1 = cy; break;
				//case 'cm': 
				//case 'mc':  
				//case 'cc':  
				//case 'mm': break; // what do you want?
				case 'rc':
				case 'rm':  x0 = ex; y0 = cy; x1 = sx; y1 = cy; break;
				case 'lb':
				case 'bl':  x0 = sx; y0 = ey; x1 = ex; y1 = sy; break;
				case 'bc':
				case 'bm':  x0 = cx; y0 = ey; x1 = cx; y1 = sy; break;
				case 'rb':
				case 'br':  x0 = ex; y0 = ey; x1 = sx; y1 = sy; break;
				default:    x0 = sx; y0 = sy; x1 = ex; y1 = ey; break;
			}
			grd = ctx.createLinearGradient(x0, y0, x1, y1);
			break;

		case 'r':   // RadialGradient
			switch (gOrg) {
				case 'lt':
				case 'tl':  x0 = x1 = sx; y0 = y1 = sy; r1 = Math.max(width, height);   break;
				case 'tc':
				case 'tm':  x0 = x1 = cx; y0 = y1 = sy; r1 = Math.max(cx, height);      break;
				case 'rt':
				case 'tr':  x0 = x1 = ex; y0 = y1 = sy; r1 = Math.max(width, height);   break;
				case 'lc':
				case 'lm':  x0 = x1 = sx; y0 = y1 = cy; r1 = Math.max(width, cy);       break;
				case 'cm':
				case 'mc':
				case 'cc':
				case 'mm':  x0 = x1 = cx; y0 = y1 = cy; r1 = Math.max(cx, cy);          break;
				case 'rc':
				case 'rm':  x0 = x1 = ex; y0 = y1 = cy; r1 = Math.max(width, cy);       break;
				case 'lb':
				case 'bl':  x0 = x1 = sx; y0 = y1 = ey; r1 = Math.max(width, height);   break;
				case 'bc':
				case 'bm':  x0 = x1 = cx; y0 = y1 = ey; r1 = Math.max(cx, height);      break;
				case 'rb':
				case 'br':  x0 = x1 = ex; y0 = y1 = ey; r1 = Math.max(width, height);   break;
				default:    x0 = x1 = sx; y0 = y1 = sy; r1 = Math.max(width, height);   break;
			}
			grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
			break;

		default:
			grd = ctx.createLinearGradient(sx, sy, ex, ey);
			break;
	}

	if (grd != null) {
		for (loop = 0; loop < gColors.length; loop++) {
			grd.addColorStop(gColors[loop].pos, gColors[loop].val);
		}
		ctx.fillStyle = grd;
	}
}

// If drawn shapes ====================================================================================
function figureDraw(cv, shapeType, borderWidth, borderColor, fillColor, dashType) {
	var aryCoordset = null;
	var strCoordset = cv.getAttribute("data-pubtreediagramcoords");
	if (strCoordset != null) {
		aryCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
	}
	shapeType = shapeType.replace(/ /g, '').toLowerCase();

	var ctx = cv.getContext('2d');
	var border = eval(borderWidth);
	var width = cv.width;   //cv.clientWidth - cv.clientLeft - cv.style.paddingLeft.replace(/[^-\.0-9]/g, '') - cv.style.paddingRight.replace(/[^-\.0-9]/g, ''); //cv.style.width.replace(/[^-\.0-9]/g, '');
	var height = cv.height; //cv.clientHeight - cv.clientTop - cv.style.paddingTop.replace(/[^-\.0-9]/g, '') - cv.style.paddingBottom.replace(/[^-\.0-9]/g, ''); //cv.style.height.replace(/[^-\.0-9]/g, '');
	ctx.clearRect(0, 0, width, height); //canvas clear

	var dash = eval(dashType);
	var fw = border; var bw = 0;
	switch (dash) {
		case -1:
			borderColor = fillColor.replace(",1)", ",0)");
			border = 0;
			break;
		case 1:
		case 2:
		case 3:
			fw = border * dash;
			bw = border;
			break;
	}

	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = borderColor;
	setGradient(ctx, null, fillColor, true);
	ctx.lineWidth = border;

	switch (shapeType) {
		//polygon 
		case 'rect':                drawFigureRect(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);        break;
		case 'rectcutsingle':       drawFigureRectSingleCut(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'rectcutdouble':       drawFigureRectDoubleCut(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'rectcutacross':       drawFigureRectAcrossCut(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'rectround':           drawFigureRectAllRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);      break;
		case 'rectroundsingle':     drawFigureRectSingleRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		case 'rectrounddouble':     drawFigureRectDoubleRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		case 'rectroundacross':     drawFigureRectAcrossRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		case 'circle':              drawFigureCircle(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);      break;
		case 'parallel':
		case 'trapezoidal':         drawFigureTrapezoidal(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);       break;
		case 'parallelogram':       drawFigureParallelogram(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'triangle':            drawFigureTriangle(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'diamond':
		case 'tetragon':            drawFigureTetragon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'pentagon':            drawFigurePentagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'hexagon':             drawFigureHexagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);           break;
		case 'heptagon':            drawFigureHeptagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'octagon':             drawFigureOctagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);           break;
		case 'nonagon':             drawFigureNonagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);           break;
		case 'decagon':             drawFigureDecagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);           break;
		case 'dodecagon':           drawFigureDodecagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);         break;
		//pentacle 
		case 'tristar':             drawFigureTristar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);           break;
		case 'tetragonalstar':      drawFigureTetragonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		case 'star':
		case 'pentagonalstar':      drawFigurePentagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		case 'hexagonalstar':       drawFigureHexagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'heptagonalstar':      drawFigureHeptagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		case 'octagonalstar':       drawFigureOctagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'nonagonalstar':       drawFigureNonagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'decagonalstar':       drawFigureDecagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'dodecagonalstar':     drawFigureDodecagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		case 'sixteenstar':         drawFigureSixteenstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);       break;
		case 'twentyfourstar':      drawFigureTwentyfourstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		case 'thirtytwostar':       drawFigureThirtytwostar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		//Arrow 
		case 'singlearrow':
		case 'singlearrow2':        drawFigureSingleArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true); break;
		case 'doublearrow':         drawFigureDoubleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);       break;
		case 'slopesinglearrow':    drawFigureSlopeSingleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  break;
		case 'turnsinglearrow':     drawFigureTurnSingleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		case 'turndoublearrow':     drawFigureTurnDoubleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		case 'curvesinglearrow':    drawFigureCurveSingleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  break;
		case 'stripedarrow':        drawFigureStripedArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);      break;
		//Comments and expressions 
		case 'memobox':             drawFigureMemoboxRect(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);       break;
		case 'memoboxround':        drawFigureMemoboxRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);      break;
		case 'memoboxcloud':        drawFigureMemoboxCloud(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);      break;
		case 'memoboxballoon':      drawFigureMemoboxBalloon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		case 'memoboxadballoon':    drawFigureMemoboxAdballoon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  break;
		case 'ribbon1':             drawFigureRibbonRect(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);        break;
		case 'ribbon2':             drawFigureRibbonRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);       break;
		case 'rollpaper1':          drawFigureRollpaper1(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  break;
		case 'rollpaper2':          drawFigureRollpaper2(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  break;
		case 'banner1':             drawFigureBanner1(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'banner2':             drawFigureBanner2(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'smile':               drawFigureSmile(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);             break;
		case 'oops':                drawFigureOops(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);              break;
		case 'surprise':            drawFigureSurprise(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		//Three-dimensional shape   
		case 'pyramid':             drawFigurePyramid(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);           break;
		case 'pyramiddotted':       drawFigurePyramidDotted(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'pyramiddotted2':      drawFigurePyramidDotted2(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		case 'cylinder':            drawFigureCylinder(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'cylinderdotted':      drawFigureCylinderDotted(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		case 'hexahedron':          drawFigureHexahedron(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);        break;
		case 'hexahedrondotted':    drawFigureHexahedronDotted(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  break;
		case 'pushbutton':          drawFigureIconPushbutton(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		//Icon Collection       
		case 'playbackward':        drawFigureIconPlayBackward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  break;
		case 'playforward':         drawFigureIconPlayForward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		case 'fastbackward':        drawFigureIconFastBackward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  break;
		case 'fastforward':         drawFigureIconFastForward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		case 'gotostart':           drawFigureIconGotoStart(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     break;
		case 'gotoend':             drawFigureIconGotoEnd(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);       break;
		case 'pause':               drawFigureIconPause(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);         break;
		case 'stop':                drawFigureIconStop(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'sound':               drawFigureIconSound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);         break;
		case 'mute':                drawFigureIconMute(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'video':               drawFigureIconVideo(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);         break;
		case 'audio':               drawFigureIconAudio(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);         break;
		case 'document':            drawFigureIconDocument(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);      break;
		case 'home':                drawFigureIconHome(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'return':              drawFigureIconReturn(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);        break;
		case 'previous':            drawFigureIconPrevious(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);      break;
		case 'next':                drawFigureIconNext(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'okey':                drawFigureIconOkey(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);          break;
		case 'cancel':              drawFigureIconCancel(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);        break;
		case 'question':            drawFigureIconQuestion(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);      break;
		case 'information':         drawFigureIconInformation(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		//Operator collection  
		case 'plus':                drawFigurePlus(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);        break;
		case 'minus':               drawFigureMinus(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);       break;
		case 'multiple':            drawFigureMultiple(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		case 'divide':              drawFigureDivide(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);      break;
		case 'equal':               drawFigureEqual(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);       break;
		case 'notequal':            drawFigureNotequal(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    break;
		case 'under':               drawFigureUnder(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);       break;
		case 'over':                drawFigureOver(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);        break;
		//Process
		case 'process':             drawFigureProcess(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true); 	break;
		case 'alternateprocess':	 drawFigureAlternateProcess(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  	break;
		case 'decisions':			 drawFigureDecision(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);  		break;
		case 'data':				 drawFigureData(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    			break;
		case 'predefinedprocess':	 drawFigurePredefinedProcess(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);	break;
		case 'inputoroutput':		 drawFigureInputorOutput(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    	break;
		case 'internalstorage':	 drawFigureInternalStorage(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true); 		break;
		case 'documents':			 drawFigureDocument(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);	break;
		case 'delay':				 drawFigureDelay(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   	break;
		case 'offpageconnector':	 drawFigureOffPageConnector(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);   break;
		case 'manualinput':	 	 drawFigureManualInput(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);	     break;
		case 'manualoperation':	 drawFigureManualOperation(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);	 break;
		case 'storeddata':		 drawFigureStoredData(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);	 break;
		case 'database':            drawFigureDataBase(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);           break;
		case 'magnetictape':	 	 drawFigureMagneticTape(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true); 		 break;
		case 'offlinestorage':      drawFigureOfflineStorage(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);     	 break;
		case 'display':	 		 drawFigureDisplay(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    	  break;
		case 'preparation':	 	 drawFigurePreparation(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    	  break;
		case 'punchedcard':	 	 drawFigurePunchedCard(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    	  break;
		case 'punchedtape':	 	 drawFigurePunchedTape(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);    	  break;
		case 'keying':			 drawFigureKeying(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);		break;
		case 'sort':			 	 drawFigureSort(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);		break;
		case 'mergestorage':		 drawFigureMergeStroage(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);		break;
		case 'extract':		 	 drawFigureExtract(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);		break;
		case 'collate':		 	 drawFigureCollate(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);		break;
		case 'summing':            drawFigureSummingJunction(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);           break;
		case 'logicalor':		 	 drawFigureLogicalOr(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);		break;
		case 'page':				drawFigureCircle(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, true);		break;
	}
	pathCloseAndFinish(ctx, fw, bw);
}

// Drawing Shapes ====================================================================================
function PubtreeCanvasDraw(id) {
	
	var cv = $("#" + id);
	var strDataset = cv.attr("data-pubtreediagramsetting");
	if (strDataset == null) {
		/*alert("Invalid : pubtreediagramsetting.");*/
		return;
	}

	var aryDataset = new String(strDataset.replace(/ /g, '').toLowerCase()).split("|");
	var functionName = aryDataset[0];
	
    if (functionName == "linedraw") {
        var borderType, arrowType, borderWidth, borderColor, dashType = 0;
        for (loop = 1; loop < aryDataset.length; loop++) {
            switch (loop) {
                case 1: borderType = aryDataset[loop];  break;
                case 2: arrowType = aryDataset[loop];   break;
                case 3: borderWidth = aryDataset[loop]; break;
                case 4: borderColor = aryDataset[loop]; break;
                case 5: dashType = aryDataset[loop];    break;
                default:alert("Invalid : too many parameters in linedraw diagramsetting."); break;
            }
        }
        lineDraw(cv[0], borderType, arrowType, borderWidth, borderColor, dashType);
	} else	if (functionName == "figuredraw") {
		var shapeType, borderWidth, borderColor, fillColor, dashType = 0;
		for (loop = 1; loop < aryDataset.length; loop++) {
			switch (loop) {
				case 1: shapeType = aryDataset[loop];   break;
				case 2: borderWidth = aryDataset[loop]; break;
				case 3: borderColor = aryDataset[loop]; break;
				case 4: fillColor = aryDataset[loop];   break;
				case 5: dashType = aryDataset[loop];    break;
				default:alert("Invalid : too many parameters in figuredraw diagramsetting."); break;
			}
		}
		figureDraw(cv[0], shapeType, borderWidth, borderColor, fillColor, dashType);
	} else if (functionName == "linedraw2") {
		var borderType, arrowType, borderWidth, borderColor, dashType, lineHead, lineTail, weight = 0;
		for (loop = 1; loop < aryDataset.length; loop++) {
			// alert(aryDataset[loop]);
			switch (loop) {
				case 1: borderType = aryDataset[loop];	break;
				case 2: arrowType = aryDataset[loop];	break;
				case 3: borderWidth = aryDataset[loop];	break;
				case 4: borderColor = aryDataset[loop];	break;
				case 5: lineHead = aryDataset[loop]; 	break;
				case 6: lineTail = aryDataset[loop];	break;
				case 7: weight = aryDataset[loop];		break;
				case 8: dashType = aryDataset[loop];   	break;
				default:alert("Invalid : too many parameters in linedraw diagramsetting."); break;
			}
		}
		
		lineDraw2(cv[0], borderType, arrowType, borderWidth, borderColor, dashType, lineHead, lineTail, weight);
	} else
		alert("Invalid : functionName.");
}

// A virtual line drawn shapes ====================================================================================
// A virtual line drawn shapes ====================================================================================
function lineShadow(cv, borderType, arrowType, borderWidth, borderColor, dashType, shadowcoords) {
    var aryCoordset = null;
    var strCoordset = shadowcoords;
    if (strCoordset != null) {
        aryCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
    }
    borderType = borderType.replace(/ /g, '').toLowerCase();
    arrowType = arrowType.replace(/ /g, '').toLowerCase();

    var ctx = cv.getContext('2d');
    var border = eval(borderWidth);
    var width = cv.width;   //cv.clientWidth - cv.clientLeft - cv.style.paddingLeft.replace(/[^-\.0-9]/g, '') - cv.style.paddingRight.replace(/[^-\.0-9]/g, ''); //cv.style.width.replace(/[^-\.0-9]/g, '');
    var height = cv.height; //cv.clientHeight - cv.clientTop - cv.style.paddingTop.replace(/[^-\.0-9]/g, '') - cv.style.paddingBottom.replace(/[^-\.0-9]/g, ''); //cv.style.height.replace(/[^-\.0-9]/g, '');
    //ctx.clearRect(0, 0, width, height); //canvas clear

    var dash = eval(dashType);
    var fw = border; var bw = 0;
    switch (dash) {
        case 1:
        case 2:
        case 3:
            fw = border * dash;
            bw = border;
            break;
    }

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = borderColor.replace(",1)", ",0.5)");  //alpha
    ctx.fillStyle = borderColor.replace(",1)", ",0.5)");    //alpha
    ctx.lineWidth = border;
	
    var shapeType = borderType + arrowType;
    switch (shapeType) {
        case 'linenone':                drawLineNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                        break;
        case 'linesingle':              drawLineSingleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                      break;
        case 'linedouble':              drawLineDoubleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                      break;
        case 'turnnone':                drawLineTurnNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                    break;
        case 'turnsingle':              drawLineTurnSingleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                  break;
        case 'turndouble':              drawLineTurnDoubleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                  break;
        case '2turnnone':               drawLine2TurnNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                   break;
        case '2turnsingle':             drawLine2TurnSingleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                 break;
        case '2turndouble':             drawLine2TurnDoubleArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                 break;
        case 'undernone':               drawLineUnderNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                   break;
        case 'overnone':                drawLineOverNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                    break;
        case 'bezier1none':             drawLineBezier1NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                 break;
        case 'bezier2none':             drawLineBezier2NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                 break;
        case 'parabolanone':            drawLineParabolaNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                break;
        //Parentheses collection 
        case 'openparenthesisnone':     drawLineOpenparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);   break;
        case 'closeparenthesisnone':    drawLineCloseparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);  break;
        case 'doubleparenthesisnone':   drawLineDoubleparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false); break;
        case 'openbracenone':           drawLineOpenbraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);         break;
        case 'closebracenone':          drawLineClosebraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);        break;
        case 'doublebracenone':         drawLineDoublebraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);       break;
        case 'openbracketnone':         drawLineOpenbracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);       break;
        case 'closebracketnone':        drawLineClosebracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);      break;
        case 'doublebracketnone':       drawLineDoublebracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);     break;
        //Coordinate, grid 
        case 'coordinatenone':          drawLineCoordinateNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);        break;
        case 'gridnone':                drawLineGridNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);              break;
    }

    ctx.mozDash = [fw, bw];
    if (!ctx.setLineDash) {
        ctx.setLineDash = function () {}
    } else {
        ctx.setLineDash([fw,bw]);//safari "undefined function"
    }
    ctx.stroke();
    ctx.restore();
}

// Flat, graphic virtual construction ====================================================================================
function figureShadow(cv, shapeType, borderWidth, borderColor, fillColor, dashType, shadowcoords) {
	var aryCoordset = null;
	var strCoordset = shadowcoords;
	if (strCoordset != null) {
		aryCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
	}
	shapeType = shapeType.replace(/ /g, '').toLowerCase();

	var ctx = cv.getContext('2d');
	var border = eval(borderWidth);
	var width = cv.width;   //cv.clientWidth - cv.clientLeft - cv.style.paddingLeft.replace(/[^-\.0-9]/g, '') - cv.style.paddingRight.replace(/[^-\.0-9]/g, ''); //cv.style.width.replace(/[^-\.0-9]/g, '');
	var height = cv.height; //cv.clientHeight - cv.clientTop - cv.style.paddingTop.replace(/[^-\.0-9]/g, '') - cv.style.paddingBottom.replace(/[^-\.0-9]/g, ''); //cv.style.height.replace(/[^-\.0-9]/g, '');
	//ctx.clearRect(0, 0, width, height); //canvas clear

	var dash = eval(dashType);
	var fw = border; var bw = 0;
	switch (dash) {
		case -1:
			borderColor = fillColor.replace(",1)", ",0)");
			border = 0;
			break;
		case 1:
		case 2:
		case 3:
			fw = border * dash;
			bw = border;
			break;
	}

	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = borderColor.replace(",1)", ",0.5)");  //alpha
	setGradient(ctx, null, fillColor, false);
	ctx.lineWidth = border;

	switch (shapeType) {
		//polygon
		case 'rect':                drawFigureRect(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);        break;
		case 'rectcutsingle':       drawFigureRectSingleCut(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'rectcutdouble':       drawFigureRectDoubleCut(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'rectcutacross':       drawFigureRectAcrossCut(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'rectround':           drawFigureRectAllRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
		case 'rectroundsingle':     drawFigureRectSingleRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   break;
		case 'rectrounddouble':    	 drawFigureRectDoubleRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   break;
		case 'rectroundacross':     drawFigureRectAcrossRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   break;
		case 'circle':              drawFigureCircle(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
		case 'parallel':
		case 'trapezoidal':         drawFigureTrapezoidal(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);       break;
		case 'parallelogram':       drawFigureParallelogram(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'triangle':            drawFigureTriangle(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'diamond':
		case 'tetragon':            drawFigureTetragon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'pentagon':            drawFigurePentagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'hexagon':             drawFigureHexagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);           break;
		case 'heptagon':            drawFigureHeptagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'octagon':             drawFigureOctagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);           break;
		case 'nonagon':             drawFigureNonagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);           break;
		case 'decagon':             drawFigureDecagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);           break;
		case 'dodecagon':           drawFigureDodecagon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);         break;
		//pentacle
		case 'tristar':             drawFigureTristar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);           break;
		case 'tetragonalstar':      drawFigureTetragonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'star':
		case 'pentagonalstar':      drawFigurePentagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'hexagonalstar':       drawFigureHexagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'heptagonalstar':      drawFigureHeptagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'octagonalstar':       drawFigureOctagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'nonagonalstar':       drawFigureNonagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'decagonalstar':       drawFigureDecagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'dodecagonalstar':     drawFigureDodecagonalstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   break;
		case 'sixteenstar':         drawFigureSixteenstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);       break;
		case 'twentyfourstar':      drawFigureTwentyfourstar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'thirtytwostar':       drawFigureThirtytwostar(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		//arrow
		case 'singlearrow':
		case 'singlearrow2':        drawFigureSingleArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false); break;
		case 'doublearrow':         drawFigureDoubleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);       break;
		case 'slopesinglearrow':    drawFigureSlopeSingleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);  break;
		case 'turnsinglearrow':     drawFigureTurnSingleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   break;
		case 'turndoublearrow':     drawFigureTurnDoubleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   break;
		case 'curvesinglearrow':    drawFigureCurveSingleArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);  break;
		case 'stripedarrow':        drawFigureStripedArrow(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
		//Comments and expressions
		case 'memobox':             drawFigureMemoboxRect(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);       break;
		case 'memoboxround':        drawFigureMemoboxRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
		case 'memoboxcloud':        drawFigureMemoboxCloud(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
		case 'memoboxballoon':      drawFigureMemoboxBalloon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'memoboxadballoon':    drawFigureMemoboxAdballoon(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);  break;
		case 'ribbon1':             drawFigureRibbonRect(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);        break;
		case 'ribbon2':             drawFigureRibbonRound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);       break;
		case 'rollpaper1':          drawFigureRollpaper1(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);  break;
		case 'rollpaper2':          drawFigureRollpaper2(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);  break;
		case 'banner1':             drawFigureBanner1(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'banner2':             drawFigureBanner2(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'smile':               drawFigureSmile(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);             break;
		case 'oops':                drawFigureOops(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);              break;
		case 'surprise':            drawFigureSurprise(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		//Three-dimensional shape  
		case 'pyramid':             drawFigurePyramid(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);           break;
		case 'pyramiddotted':       drawFigurePyramidDotted(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'pyramiddotted2':      drawFigurePyramidDotted2(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'cylinder':            drawFigureCylinder(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'cylinderdotted':      drawFigureCylinderDotted(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'hexahedron':          drawFigureHexahedron(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);        break;
		case 'hexahedrondotted':    drawFigureHexahedronDotted(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);  break;
		case 'pushbutton':          drawFigureIconPushbutton(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		//Icon Collection 
		case 'playbackward':        drawFigureIconPlayBackward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);  break;
		case 'playforward':         drawFigureIconPlayForward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   break;
		case 'fastbackward':        drawFigureIconFastBackward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);  break;
		case 'fastforward':         drawFigureIconFastForward(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   break;
		case 'gotostart':           drawFigureIconGotoStart(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'gotoend':             drawFigureIconGotoEnd(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);       break;
		case 'pause':               drawFigureIconPause(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);         break;
		case 'stop':                drawFigureIconStop(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'sound':               drawFigureIconSound(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);         break;
		case 'mute':                drawFigureIconMute(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'video':               drawFigureIconVideo(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);         break;
		case 'audio':               drawFigureIconAudio(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);         break;
		case 'document':            drawFigureIconDocument(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
		case 'home':                drawFigureIconHome(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'return':              drawFigureIconReturn(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);        break;
		case 'previous':            drawFigureIconPrevious(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
		case 'next':                drawFigureIconNext(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'okey':                drawFigureIconOkey(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'cancel':              drawFigureIconCancel(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);        break;
		case 'question':            drawFigureIconQuestion(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
		case 'information':         drawFigureIconInformation(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   break;
		//Operator collection
		case 'plus':                drawFigurePlus(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);        break;
		case 'minus':               drawFigureMinus(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);       break;
		case 'multiple':            drawFigureMultiple(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'divide':              drawFigureDivide(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
		case 'equal':               drawFigureEqual(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);       break;
		case 'notequal':            drawFigureNotequal(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'under':               drawFigureUnder(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);       break;
		case 'over':                drawFigureOver(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);        break;
		//Process
		case 'process':             drawFigureProcess(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'alternateprocess':	 drawFigureAlternateProcess(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);			break;
		case 'decisions':			 drawFigureDecision(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);			 break;
		case 'data':				 drawFigureData(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    	break;
		case 'predefinedprocess':	 drawFigurePredefinedProcess(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);   	break;
		case 'inputoroutput':		 drawFigureInputorOutput(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    	 break;
		case 'internalstorage':	 drawFigureInternalStorage(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    	break;
		case 'documents':			 drawFigureDocument(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'delay':			 	 drawFigureDelay(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    	  break;
		case 'offpageconnector':	 drawFigureOffPageConnector(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);	  break;
		case 'manualinput':	 	 drawFigureManualInput(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);		  break;
		case 'manualoperation':	 drawFigureManualOperation(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);	  break;
		case 'storeddata':		 drawFigureStoredData(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    break;
		case 'database':            drawFigureDataBase(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);          break;
		case 'magnetictape':	 	 drawFigureMagneticTape(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    	  break;
		case 'offlinestorage':      drawFigureOfflineStorage(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);     break;
		case 'display':	 		 drawFigureDisplay(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    	  break;
		case 'preparation':	 	 drawFigurePreparation(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    	  break;
		case 'punchedcard':	 	 drawFigurePunchedCard(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    	  break;
		case 'punchedtape':	 	 drawFigurePunchedTape(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);    	  break;
		case 'keying':			 drawFigureKeying(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);		break;
		case 'sort':				 drawFigureSort(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);		break;
		case 'mergestorage':		 drawFigureMergeStroage(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);	break;
		case 'extract':		 	 drawFigureExtract(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);		break;
		case 'collate':		 	 drawFigureCollate(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);		break;
		case 'summing':            drawFigureSummingJunction(ctx, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);           break;
		case 'logicalor':		 	 drawFigureLogicalOr(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);		break;
		case 'page':		 	 	drawFigureCircle(ctx, 0, 0, width, height, aryCoordset, border, dash, borderColor, fillColor, fw, bw, false);      break;
	}

	pathCloseAndFinish(ctx, fw, bw);
}

// Drawing shapes and virtual ====================================================================================
function PubtreeCanvasDrawAndShadow(id, shadowcoords) {
	var cv = $("#" + id);
	var strDataset = cv.attr("data-pubtreediagramsetting");
	if (strDataset == null) {
		/*alert("Invalid : pubtreediagramsetting.");*/
		return;
	}

	var aryDataset = new String(strDataset.replace(/ /g, '').toLowerCase()).split("|");
	var functionName = aryDataset[0];

    if (functionName == "linedraw") {
        var borderType, arrowType, borderWidth, borderColor, dashType = 0;
        for (loop = 1; loop < aryDataset.length; loop++) {
            switch (loop) {
                case 1: borderType = aryDataset[loop];  break;
                case 2: arrowType = aryDataset[loop];   break;
                case 3: borderWidth = aryDataset[loop]; break;
                case 4: borderColor = aryDataset[loop]; break;
                case 5: dashType = aryDataset[loop];    break;
                default: alert("Invalid : too many parameters in linedraw diagramsetting."); break;
            }
        }
        lineDraw(cv[0], borderType, arrowType, borderWidth, borderColor, dashType);
        lineShadow(cv[0], borderType, arrowType, borderWidth, borderColor, dashType, shadowcoords);
    } else if (functionName == "figuredraw") {
		var shapeType, borderWidth, borderColor, fillColor, dashType = 0;
		for (loop = 1; loop < aryDataset.length; loop++) {
			switch (loop) {
				case 1: shapeType = aryDataset[loop];   break;
				case 2: borderWidth = aryDataset[loop]; break;
				case 3: borderColor = aryDataset[loop]; break;
				case 4: fillColor = aryDataset[loop];   break;
				case 5: dashType = aryDataset[loop];    break;
				default: alert("Invalid : too many parameters in figuredraw diagramsetting."); break;
			}
		}
		figureDraw(cv[0], shapeType, borderWidth, borderColor, fillColor, dashType);
		figureShadow(cv[0], shapeType, borderWidth, borderColor, fillColor, dashType, shadowcoords);
	}else if (functionName == "linedraw2"){
		var borderType, arrowType, borderWidth, borderColor, dashType, lineHead, lineTail, weight = 0;
		for (loop = 1; loop < aryDataset.length; loop++) {
			switch (loop) {
				case 1: borderType = aryDataset[loop];  break;
				case 2: arrowType = aryDataset[loop];   break;
				case 3: borderWidth = aryDataset[loop]; break;
				case 4: borderColor = aryDataset[loop]; break;
				case 5: lineHead = aryDataset[loop]; 	break;
				case 6: lineTail = aryDataset[loop];	break;
				case 7: weight = aryDataset[loop];		break;
				case 8: dashType = aryDataset[loop];    break;
				default: alert("Invalid : too many parameters in linedraw diagramsetting."); break;
			}
		}
		lineDraw2(cv[0], borderType, arrowType, borderWidth, borderColor, dashType, lineHead, lineTail, weight);
		lineShadow2(cv[0], borderType, arrowType, borderWidth, borderColor, lineHead, lineTail, weight, dashType, shadowcoords);
	} else
		alert("Invalid : functionName.");
}

// Line Drawing Shapes ====================================================================================
function lineDraw2(cv, borderType, arrowType, borderWidth, borderColor, dashType, lineHead, lineTail, weight) {
	var aryCoordset = null;
	var strCoordset = cv.getAttribute("data-pubtreediagramcoords");
	if (strCoordset != null) {
		aryCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
	}
	borderType = borderType.replace(/ /g, '').toLowerCase();
	arrowType = arrowType.replace(/ /g, '').toLowerCase();
	
	var ctx = cv.getContext('2d');
	var border = eval(borderWidth);
	var width = cv.width;   //cv.clientWidth - cv.clientLeft - cv.style.paddingLeft.replace(/[^-\.0-9]/g, '') - cv.style.paddingRight.replace(/[^-\.0-9]/g, ''); //cv.style.width.replace(/[^-\.0-9]/g, '');
	var height = cv.height; //cv.clientHeight - cv.clientTop - cv.style.paddingTop.replace(/[^-\.0-9]/g, '') - cv.style.paddingBottom.replace(/[^-\.0-9]/g, ''); //cv.style.height.replace(/[^-\.0-9]/g, '');
	ctx.clearRect(0, 0, width, height); //canvas clear
	
	var dash = eval(dashType);
	var fw = border; var bw = 0;
	switch (dash) {
		case 1:
		case 2:
		case 3:
			fw = border * dash;
			bw = border;
			break;
	}

	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = borderColor;
	ctx.fillStyle = borderColor;
	ctx.lineWidth = border;

	var shapeType = borderType;

	switch (shapeType) {
		case 'line':				drawLine(ctx, width, height, aryCoordset, border, lineHead, lineTail, weight, dash, fw, bw, true);		break;
		case 'turn':                drawTurn(ctx, width, height, aryCoordset, border, lineHead, lineTail, weight, dash, fw, bw, true);		break;
		case '2turn':     			drawTurn2(ctx, width, height, aryCoordset, border, lineHead, lineTail, weight, dash, fw, bw, true);		break;
		case 'under':               drawLineUnderNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                    break;
		case 'over':                drawLineOverNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                     break;
		case 'bezier1':             drawLineBezier1NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                  break;
		case 'bezier2':             drawLineBezier2NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                  break;
		case 'parabola':            drawLineParabolaNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, true);                 break;
		//Parentheses collection 
		case 'openparenthesis':     drawLineOpenparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);    break;
		case 'closeparenthesis':    drawLineCloseparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);   break;
		case 'doubleparenthesis':   drawLineDoubleparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);  break;
		case 'openbrace':           drawLineOpenbraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);          break;
		case 'closebrace':          drawLineClosebraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);         break;
		case 'doublebrace':         drawLineDoublebraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);        break;
		case 'openbracketn':         drawLineOpenbracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);        break;
		case 'closebracket':        drawLineClosebracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);       break;
		case 'doublebracket':       drawLineDoublebracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);      break;
		//Coordinate, grid 
		case 'coordinate':          drawLineCoordinateNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);         break;
		case 'grid':                drawLineGridNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, true);               break;
	}

	ctx.mozDash = [fw, bw];
	if (!ctx.setLineDash) {
		ctx.setLineDash = function () {}
	} else {
		ctx.setLineDash([fw,bw]);//safari "undefined function"
	}
	ctx.stroke();
	ctx.restore();
}

// A virtual line drawn shapes ====================================================================================
function lineShadow2(cv, borderType, arrowType, borderWidth, borderColor, lineHead, lineTail, weight, dashType, shadowcoords) {
	var aryCoordset = null;
	var strCoordset = shadowcoords;
	if (strCoordset != null) {
		aryCoordset = new String(strCoordset.replace(/ /g, '').toLowerCase()).split(";");
	}
	borderType = borderType.replace(/ /g, '').toLowerCase();
	arrowType = arrowType.replace(/ /g, '').toLowerCase();

	var ctx = cv.getContext('2d');
	var border = eval(borderWidth);
	var width = cv.width;   //cv.clientWidth - cv.clientLeft - cv.style.paddingLeft.replace(/[^-\.0-9]/g, '') - cv.style.paddingRight.replace(/[^-\.0-9]/g, ''); //cv.style.width.replace(/[^-\.0-9]/g, '');
	var height = cv.height; //cv.clientHeight - cv.clientTop - cv.style.paddingTop.replace(/[^-\.0-9]/g, '') - cv.style.paddingBottom.replace(/[^-\.0-9]/g, ''); //cv.style.height.replace(/[^-\.0-9]/g, '');
	//ctx.clearRect(0, 0, width, height); //canvas clear
	
	var dash = eval(dashType);
	var fw = border; var bw = 0;
	switch (dash) {
		case 1:
		case 2:
		case 3:
			fw = border * dash;
			bw = border;
			break;
	}

	
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = borderColor.replace(",1)", ",0.5)");  //alpha
	ctx.fillStyle = borderColor.replace(",1)", ",0.5)");    //alpha
	ctx.lineWidth = border;

	var shapetype = borderType;
	
	switch (shapetype) {
		case 'line':					drawLine(ctx, width, height, aryCoordset, border, lineHead, lineTail, weight, dash, fw, bw, false);		break;
		case 'turn':                	drawTurn(ctx, width, height, aryCoordset, border, lineHead, lineTail, weight, dash, fw, bw, false);		break;
		case '2turn':					drawTurn2(ctx, width, height, aryCoordset, border, lineHead, lineTail, weight, dash, fw, bw, false);    break;
		case 'under':              		drawLineUnderNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                   break;
		case 'over':               	  	drawLineOverNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                    break;
		case 'bezier1':         	    drawLineBezier1NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                 break;
		case 'bezier2':             	drawLineBezier2NoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                 break;
		case 'parabola':     	        drawLineParabolaNoneArrow(ctx, width, height, aryCoordset, border, dash, fw, bw, false);                break;
		//Parentheses collection 
		case 'openparenthesis': 	    drawLineOpenparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);   break;
		case 'closeparenthesis':    	drawLineCloseparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);  break;
		case 'doubleparenthesis':   	drawLineDoubleparenthesisNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false); break;
		case 'openbrace':           	drawLineOpenbraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);         break;
		case 'closebrace':          	drawLineClosebraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);        break;
		case 'doublebrace':         	drawLineDoublebraceNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);       break;
		case 'openbracket':         	drawLineOpenbracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);       break;
		case 'closebracket':        	drawLineClosebracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);      break;
		case 'doublebracket':       	drawLineDoublebracketNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);     break;
		//Coordinate, grid 
		case 'coordinate':          	drawLineCoordinateNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);        break;
		case 'grid':                	drawLineGridNoneArrow(ctx, 0, 0, width, height, aryCoordset, border, dash, fw, bw, false);              break
	}

	ctx.mozDash = [fw, bw];
	if (!ctx.setLineDash) {
		ctx.setLineDash = function () {}
	} else {
		ctx.setLineDash([fw,bw]);//safari "undefined function"
	}
	ctx.stroke();
	ctx.restore();
}

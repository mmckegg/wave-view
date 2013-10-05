module.exports = function(){

  var width = 1000
  var height = 500

  var wave = Element('path', {
    'style': 'fill:#AAA'
  })

  var selection = Element('rect', {
    'x': 0, 'y': 0,
    'width': width,
    'height': height,
    'style': 'fill: rgba(117, 255, 98, 0.36);mix-blend-mode: overlay;'
  })

  var baseLine = Element('path', {
    'd': 'M0,' + height/2 + ' L1000,' + height/2,
    'style': 'stroke-width:1; stroke:#AAA'
  })

  var svg = Element('svg', {
    'class': 'WaveView',
    'viewBox': "0 0 " + width + " " + height,
    'preserveAspectRatio': 'none'
  })

  svg.appendChild(wave)
  svg.appendChild(baseLine)
  svg.appendChild(selection)

  var audioContext = new webkitAudioContext()


  svg.setValue = function(buffer){
    wave.setAttribute('d', getPathForBuffer(buffer, width, height))
  }

  svg.setOffset = function(offset){
    var x1 = offset[0]*width
    var x2 = offset[1]*width
    selection.setAttribute('width', x2-x1)
    selection.setAttribute('x', x1)
  }

  return svg
}

function getPathForBuffer(buffer, width, height){
  var data = buffer.getChannelData(0)
  var step = Math.ceil( data.length / width )
  var amp = (height / 2)

  var maxValues = []
  var minValues = []

  for(var i=0;i<width;i++){
    var min = 1.0
    var max = -1.0
    for (j=0; j<step; j++) {
      var datum = data[(i*step)+j]
      if (datum < min){
        min = datum
      }
      if (datum > max){
        max = datum
      }
    }

    maxValues[i] = max
    minValues[i] = min
  }

  // top
  var result = 'M0,' + (height/2)
  maxValues.forEach(function(val, i){
    result += ' L' + i + ',' + Math.round(amp+(val*amp))
  })

  // end point
  result += ' L' + width + ',' + (height/2)


  // bottom
  minValues.reverse().forEach(function(val,i){
    result += ' L' + (width-i-1) + ',' + Math.round(amp+(val*amp))
  })

  return result + ' Z'
}

function Element(name, attributes){
  var element = document.createElementNS("http://www.w3.org/2000/svg", name)
  attributes && Object.keys(attributes).forEach(function(key){
    element.setAttribute(key, attributes[key])
  })
  return element
}
importScripts("/pyodide/v0.22.1/full/pyodide.js");

const PYTHON_CODE = `import micropip
await micropip.install('icepool==1.1.2')
import js
from pyodide.ffi import to_js


# Return value for Javascript
to_js({0: 54, 1: 23, 2: 4})`;

let pyodide;


async function initPyodide() {
  self.postMessage({command: 'status', value: 'loading', description: 'Initializing icepool worker'})
  self.pyodide = await self.loadPyodide({
    indexURL: '/pyodide/v0.22.1/full/'
  }) // eslint-disable-line no-restricted-globals
  await self.pyodide.loadPackage(['micropip']) // eslint-disable-line no-restricted-globals
  self.postMessage({command: 'status', value: 'ready', description: 'Icepool worker ready'})
}


async function calculateProbability(p) {
  let pythonFunction = await self.pyodide.runPythonAsync(PYTHON_CODE) // eslint-disable-line no-restricted-globals
  return pythonFunction(
    p['successValueA'], p['burstA'], p['damageA'], p['armA'], p['btsA'], p['ammoA'],
    p['contA'], p['critImmuneA'],
    p['successValueB'], p['burstB'], p['damageB'], p['armB'], p['btsB'], p['ammoB'],
    p['contB'], p['critImmuneB'],
    p['dtwVsDodge'], p['fixedFaceToFace'])
}


self.onmessage = async (msg) => {
  if(msg.data.command === 'calculate') {
    if(self.pyodide === undefined) {
      self.postMessage({command: 'status', value: 'notready', description: 'Pyodide not ready yet'})
      return
    }
    let startTime = Date.now();
    let results = await calculateProbability(msg.data.data)
    results['parameters'] = msg.data.data;
    results['id'] = Date.now();
    let elapsed = Date.now() - startTime;
    console.log('Returning results from Face 2 Face calculations:')
    console.log(results)
    self.postMessage({command: 'result', value: results, description: 'testing', elapsed: elapsed, totalRolls: results['total_rolls']})
  } else if (msg.data.command === 'init') {
    await initPyodide()
  }
}

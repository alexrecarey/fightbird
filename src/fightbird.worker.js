importScripts("https://infinitythecalculator.com/pyodide/v0.22.1/full/pyodide.js");

const PYTHON_CODE = `import micropip
await micropip.install('icepool==1.1.2')
import js
from pyodide.ffi import to_js
from icepool import Die, Pool, highest

red_die = Die({2: 2, 1: 5, 0: 1})
orange_die = Die({1: 5, 0: 3})
yellow_die = Die({1: 3, 0: 5})
green_die = Die({-2: 1, -1: 5, 0: 2})
blue_die = Die({-1: 4, 0: 4})
black_die = Die({-1: 2, 0: 6})

expert_red_die = Die({2: 2, 1: 6})
expert_orange_die = Die({1: 6, 0: 2})
expert_yellow_die = Die({1: 5, 0: 3})
expert_green_die = Die({-2: 1, -1: 6, 0: 1})
expert_blue_die = Die({-1: 5, 0: 3})
expert_black_die = Die({-1: 4, 0: 4})


def warcrow_f2f(red, orange, yellow, green, blue, black, expertise_a, expertise_b):
    d_red = expert_red_die if expertise_a else red_die
    d_orange = expert_orange_die if expertise_a else orange_die
    d_yellow = expert_yellow_die if expertise_a else yellow_die
    d_green = expert_green_die if expertise_b else green_die
    d_blue = expert_blue_die if expertise_b else blue_die
    d_black = expert_black_die if expertise_b else black_die
    return Pool([
        red @ d_red,
        orange @ d_orange,
        yellow @ d_yellow,
        green @ d_green,
        blue @ d_blue,
        black @ d_black
    ]).sum()


def format_result(raw_die):
    result = []
    for wounds, outcomes, probability, cumulative_probability in zip(
            raw_die.outcomes(),
            raw_die.quantities(),
            raw_die.probabilities(),
            raw_die.probabilities_ge()):
        result.append({
            'id': len(result),
            'wounds': wounds,
            'outcomes': outcomes,
            'probability': float(probability),
            'cumulative_probability': float(cumulative_probability),
        })
    return result


def roll_dice(red_a, orange_a, yellow_a, green_a, blue_a, black_a, red_b, orange_b, yellow_b, green_b, blue_b, black_b,
              expertise_a, expertise_b):
    # Process both face to face rolls
    attacker = highest(warcrow_f2f(red_a, orange_a, yellow_a, green_b, blue_b, black_b, expertise_a, expertise_b), 0)
    defender = highest(warcrow_f2f(red_b, orange_b, yellow_b, green_a, blue_a, black_a, expertise_b, expertise_a), 0)

    # Return the results
    return_object = {
        'attacker': format_result(attacker),
        'defender': format_result(defender),
        'total_rolls': attacker.denominator() + defender.denominator(),
    }

    return to_js(return_object, dict_converter=js.Object.fromEntries)
    # return return_object

# Return value for Javascript
to_js(roll_dice)
`;

let pyodide;


async function initPyodide() {
  self.postMessage({command: 'status', value: 'loading', description: 'Initializing icepool worker'})
  self.pyodide = await self.loadPyodide({
    indexURL: 'https://infinitythecalculator.com/pyodide/v0.22.1/full/'
  }) // eslint-disable-line no-restricted-globals
  await self.pyodide.loadPackage(['micropip']) // eslint-disable-line no-restricted-globals
  self.postMessage({command: 'status', value: 'ready', description: 'Icepool worker ready'})
}


async function calculateProbability(p) {
  let pythonFunction = await self.pyodide.runPythonAsync(PYTHON_CODE) // eslint-disable-line no-restricted-globals
  return pythonFunction(
    p.a.red, p.a.orange, p.a.yellow, p.a.green, p.a.blue, p.a.black,
    p.b.red, p.b.orange, p.b.yellow, p.b.green, p.b.blue, p.b.black,
    p.a.expertise, p.b.expertise
  )
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

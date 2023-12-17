importScripts("https://infinitythecalculator.com/pyodide/v0.22.1/full/pyodide.js");

const PYTHON_CODE = `import micropip
await micropip.install('icepool==1.1.2')
import js
from pyodide.ffi import to_js
from icepool import Die, Pool, highest, Vector

# Die definitions
# (success, hollow success, switch, hollow switch)
red = Die([
    (2, 0, 0, 0),
    (2, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 1, 0),
    (0, 1, 1, 0),
]).map(Vector)

orange = Die([
    (1, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 0, 1),
    (1, 0, 1, 0),
    (1, 0, 1, 0),
    (0, 1, 1, 0),
    (0, 0, 1, 0),
    (0, 0, 0, 1),
]).map(Vector)

yellow = Die([
    (1, 0, 0, 0),
    (1, 0, 1, 0),
    (1, 0, 1, 0),
    (0, 1, 1, 0),
    (0, 1, 1, 0),
    (0, 0, 1, 0),
    (0, 0, 2, 0),
    (0, 0, 0, 1),
]).map(Vector)

green = Die([
    (2, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 0, 0),
    (0, 1, 1, 0),
    (0, 0, 1, 0),
]).map(Vector)

blue = Die([
    (1, 0, 0, 0),
    (1, 0, 0, 0),
    (1, 0, 0, 1),
    (1, 0, 1, 0),
    (0, 1, 1, 0),
    (0, 0, 1, 0),
    (0, 0, 1, 0),
    (0, 0, 0, 1),
]).map(Vector)

black = Die([
    (1, 0, 0, 0),
    (1, 0, 1, 0),
    (0, 1, 1, 0),
    (0, 1, 1, 0),
    (0, 0, 1, 0),
    (0, 0, 1, 0),
    (0, 0, 2, 0),
    (0, 0, 0, 1),
]).map(Vector)


red_die = Die({2: 2, 1: 5, 0: 1})
orange_die = Die({1: 5, 0: 3})
yellow_die = Die({1: 3, 0: 5})
green_die = Die({2: 1, 1: 5, 0: 2})
blue_die = Die({1: 4, 0: 4})
black_die = Die({1: 2, 0: 6})

expert_red_die = Die({2: 2, 1: 6})
expert_orange_die = Die({1: 6, 0: 2})
expert_yellow_die = Die({1: 5, 0: 3})
expert_green_die = Die({2: 1, 1: 6, 0: 1})
expert_blue_die = Die({1: 5, 0: 3})
expert_black_die = Die({1: 4, 0: 4})


def warcrow_f2f(red_pool, orange_pool, yellow_pool, green_pool, blue_pool, black_pool,
                hit_a, block_d, atk_expertise, def_expertise):
    d_red = expert_red_die if atk_expertise else red_die
    d_orange = expert_orange_die if atk_expertise else orange_die
    d_yellow = expert_yellow_die if atk_expertise else yellow_die
    d_green = expert_green_die if def_expertise else green_die
    d_blue = expert_blue_die if def_expertise else blue_die
    d_black = expert_black_die if def_expertise else black_die
    return (hit_a - block_d +
            red_pool @ d_red + orange_pool @ d_orange + yellow_pool @ d_yellow -
            green_pool @ d_green - blue_pool @ d_blue - black_pool @ d_black)


def format_f2f(raw_die):
    result = []
    for hits, outcomes, probability, cumulative_probability in zip(
            raw_die.outcomes(),
            raw_die.quantities(),
            raw_die.probabilities(),
            raw_die.probabilities_ge()):
        result.append({
            'id': len(result),
            'hits': hits,
            'outcomes': outcomes,
            'probability': float(probability),
            'cumulative_probability': float(cumulative_probability),
        })
    return result


def roll_dice(
        red_a, orange_a, yellow_a, green_a, blue_a, black_a, hit_a, block_a, expertise_a,
        red_b, orange_b, yellow_b, green_b, blue_b, black_b, hit_b, block_b, expertise_b):
    # Process both face to face rolls
    attacker_hits = highest(warcrow_f2f(
        red_a, orange_a, yellow_a, green_b, blue_b, black_b, hit_a, block_b, expertise_a, expertise_b), 0)
    defender_hits = highest(warcrow_f2f(
        red_b, orange_b, yellow_b, green_a, blue_a, black_a, hit_b, block_a, expertise_b, expertise_a), 0)
    attacker_hollow_hits = red_a @ red.marginals[1] + orange_a @ orange.marginals[1] + yellow_a @ yellow.marginals[1]
    defender_hollow_hits = red_b @ red.marginals[1] + orange_b @ orange.marginals[1] + yellow_b @ yellow.marginals[1]
    attacker_hollow_blocks = green_a @ green.marginals[1] + blue_a @ blue.marginals[1] + black_a @ black.marginals[1]
    defender_hollow_blocks = green_b @ green.marginals[1] + blue_b @ blue.marginals[1] + black_b @ black.marginals[1]
    attacker_switches = (
        red_a @ red.marginals[2] + orange_a @ orange.marginals[2] + yellow_a @ yellow.marginals[2] +
        green_a @ green.marginals[2] + blue_a @ blue.marginals[2] + black_a @ black.marginals[2])
    defender_switches = (
        red_b @ red.marginals[2] + orange_b @ orange.marginals[2] + yellow_b @ yellow.marginals[2] +
        green_b @ green.marginals[2] + blue_b @ blue.marginals[2] + black_b @ black.marginals[2])
    attacker_hollow_switches = (
        red_a @ red.marginals[3] + orange_a @ orange.marginals[3] + yellow_a @ yellow.marginals[3] +
        green_a @ green.marginals[3] + blue_a @ blue.marginals[3] + black_a @ black.marginals[3])
    defender_hollow_switches = (
        red_b @ red.marginals[3] + orange_b @ orange.marginals[3] + yellow_b @ yellow.marginals[3] +
        green_b @ green.marginals[3] + blue_b @ blue.marginals[3] + black_b @ black.marginals[3])

    # Return the results
    return_object = {
        'attacker': {
            'hits': format_f2f(attacker_hits),
            'hollow_hits': format_f2f(attacker_hollow_hits),
            'hollow_blocks': format_f2f(attacker_hollow_blocks),
            'switches': format_f2f(attacker_switches),
            'hollow_switches': format_f2f(attacker_hollow_switches),
        },
        'defender': {
            'hits': format_f2f(defender_hits),
            'hollow_hits': format_f2f(defender_hollow_hits),
            'hollow_blocks': format_f2f(defender_hollow_blocks),
            'switches': format_f2f(defender_switches),
            'hollow_switches': format_f2f(defender_hollow_switches),
        },
        'total_rolls': (
            attacker_hits.denominator() + defender_hits.denominator() +
            attacker_hollow_hits.denominator() + defender_hollow_hits.denominator() +
            attacker_switches.denominator() + defender_switches.denominator() +
            attacker_hollow_switches.denominator() + defender_hollow_switches.denominator()
        ),
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
    p.a.red, p.a.orange, p.a.yellow, p.a.green, p.a.blue, p.a.black, p.a.hit, p.a.block, p.a.expertise,
    p.b.red, p.b.orange, p.b.yellow, p.b.green, p.b.blue, p.b.black, p.b.hit, p.b.block, p.b.expertise
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

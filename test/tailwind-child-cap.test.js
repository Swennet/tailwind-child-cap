const assert = require("assert").strict;
const childCapPlugin = require("../tailwind-child-cap");

function runPlugin(options) {
    const pluginInstance = childCapPlugin(options);
    const output = {utilities: null, options: null};

    pluginInstance.handler({
        addUtilities(utilities, addOptions) {
            output.utilities = utilities;
            output.options = addOptions;
        },
    });

    return output;
}

function flattenUtilityRules(utility) {
    const rules = [];

    for (const [selector, declarations] of Object.entries(utility)) {
        if (declarations.display) {
            rules.push({selector, display: declarations.display});
        }

        for (const [nestedSelector, nestedDeclarations] of Object.entries(declarations)) {
            if (
                nestedSelector === "display" ||
                !nestedDeclarations ||
                typeof nestedDeclarations !== "object"
            ) {
                continue;
            }

            if (nestedDeclarations.display) {
                rules.push({
                    selector: selector + nestedSelector.replace(/^&/, ""),
                    display: nestedDeclarations.display,
                });
            }
        }
    }

    return rules;
}

function selectorMatchesChild(selector, childNumber) {
    if (selector === "& > *") {
        return true;
    }

    const match = selector.match(/:nth-child\(-n\+(\d+)\)/);

    return match ? childNumber <= Number.parseInt(match[1], 10) : false;
}

function selectorSpecificity(selector) {
    return selector.replace(/:where\([^)]*\)/g, "").includes(":nth-child(") ? 1 : 0;
}

function resolveChildDisplay(utilities, classNames, childNumber) {
    let winner = {display: "block", order: -1, specificity: -1};
    let order = 0;

    for (const className of classNames) {
        for (const rule of flattenUtilityRules(utilities[className])) {
            order += 1;

            if (!selectorMatchesChild(rule.selector, childNumber)) {
                continue;
            }

            const specificity = selectorSpecificity(rule.selector);

            if (
                specificity > winner.specificity ||
                (specificity === winner.specificity && order > winner.order)
            ) {
                winner = {display: rule.display, order, specificity};
            }
        }
    }

    return winner.display;
}

const tests = [
    [
        "resolveMaxRange uses defaults and supports key aliases",
        () => {
            const {resolveMaxRange, DEFAULT_MAX_RANGE} = childCapPlugin._private;

            assert.equal(resolveMaxRange(), DEFAULT_MAX_RANGE);
            assert.equal(resolveMaxRange(null), DEFAULT_MAX_RANGE);
            assert.equal(resolveMaxRange(4), DEFAULT_MAX_RANGE);
            assert.equal(resolveMaxRange({maxRange: 8}), 8);
            assert.equal(resolveMaxRange({max_range: 9}), 9);
            assert.equal(resolveMaxRange({"MAX-RANGE": 10}), 10);
            assert.equal(resolveMaxRange({maxrange: " 42 "}), 42);
        },
    ],
    [
        "resolveMaxRange falls back for invalid values",
        () => {
            const {resolveMaxRange, DEFAULT_MAX_RANGE} = childCapPlugin._private;

            assert.equal(resolveMaxRange({maxRange: 0}), DEFAULT_MAX_RANGE);
            assert.equal(resolveMaxRange({maxRange: -1}), DEFAULT_MAX_RANGE);
            assert.equal(resolveMaxRange({maxRange: "banana"}), DEFAULT_MAX_RANGE);
        },
    ],
    [
        "createUtilities builds expected child-cap utilities",
        () => {
            const {createUtilities} = childCapPlugin._private;
            const utilities = createUtilities(3);

            assert.ok(utilities[".child-cap-1"]);
            assert.ok(utilities[".child-cap-2"]);
            assert.ok(utilities[".child-cap-3"]);
            assert.equal(utilities[".child-cap-2"]["& > *"].display, "none");
            assert.equal(
                utilities[".child-cap-2"]["& > :where(:nth-child(-n+2))"].display,
                "block",
            );
            assert.equal(utilities[".child-cap-none"]["& > *"].display, "block");
            assert.equal(Object.keys(utilities).length, 4);
        },
    ],
    [
        "later smaller caps override earlier larger caps",
        () => {
            const {createUtilities} = childCapPlugin._private;
            const utilities = createUtilities(12);
            const classNames = [".child-cap-12", ".child-cap-10"];

            assert.equal(resolveChildDisplay(utilities, classNames, 10), "block");
            assert.equal(resolveChildDisplay(utilities, classNames, 11), "none");
            assert.equal(resolveChildDisplay(utilities, classNames, 12), "none");
        },
    ],
    [
        "child-cap-none removes an earlier cap",
        () => {
            const {createUtilities} = childCapPlugin._private;
            const utilities = createUtilities(12);
            const classNames = [".child-cap-10", ".child-cap-none"];

            assert.equal(resolveChildDisplay(utilities, classNames, 10), "block");
            assert.equal(resolveChildDisplay(utilities, classNames, 11), "block");
            assert.equal(resolveChildDisplay(utilities, classNames, 12), "block");
        },
    ],
    [
        "plugin handler emits utilities and Tailwind options",
        () => {
            const output = runPlugin({maxRange: 2});

            assert.ok(output.utilities[".child-cap-1"]);
            assert.ok(output.utilities[".child-cap-2"]);
            assert.ok(output.utilities[".child-cap-none"]);
            assert.equal(Object.keys(output.utilities).length, 3);
            assert.deepEqual(output.options, {
                respectPrefix: false,
                respectImportant: false,
            });
        },
    ],
];

let failures = 0;

for (const [name, test] of tests) {
    try {
        test();
        console.log(`PASS ${name}`);
    } catch (error) {
        failures += 1;
        console.error(`FAIL ${name}`);
        console.error(error.message);
    }
}

if (failures > 0) {
    process.exitCode = 1;
} else {
    console.log("All tests passed.");
}

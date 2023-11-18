import {useState} from 'react'
import Calculator from "./components/Calculator.tsx";

const DECIMAL_SEPARATOR = "." as const;

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
type DigitTuple = typeof DIGITS;
type Digit = DigitTuple[number];

const UNARY_OPERATIONS = ["+/-", "%"] as const;
type UnaryOperationTuple = typeof UNARY_OPERATIONS;
type UnaryOperator = UnaryOperationTuple[number];

const BINARY_OPERATIONS = ["/", "x", "-", "+"] as const;
type BinaryOperationTuple = typeof BINARY_OPERATIONS;
type BinaryOperator = BinaryOperationTuple[number];

const SYSTEM_OPERATIONS = ["AC", "="] as const;
type SystemOperationTuple = typeof SYSTEM_OPERATIONS;
type SystemOperation = SystemOperationTuple[number];

type CalculatorInput = Digit | UnaryOperator | BinaryOperator | SystemOperation | typeof DECIMAL_SEPARATOR;

abstract class Term {

    abstract evaluate(): number;

    abstract displayValue(): string

    getSuccessorState(input: CalculatorInput): Term {
        if (UNARY_OPERATIONS.includes(input as UnaryOperator)) {
            return new UnaryOperationTerm(input as UnaryOperator, this);
        } else if (BINARY_OPERATIONS.includes(input as BinaryOperator)) {
            return new BinaryOperationTerm(input as BinaryOperator, this);
        } else {
            switch (input as SystemOperation) {
                case "=":
                    return new NumberTerm(this.evaluate());
                case "AC":
                    return new NumberTerm(0);
                default:
                    return this;
            }
        }
    }
}

class NumberTerm extends Term {

    constructor(
        private readonly value: number,
        private readonly hasDecimalSeparatorAppendix = false
    ) {
        super();
    }

    evaluate(): number {
        return this.value;
    }

    displayValue(): string {
        return `${this.value}${this.hasDecimalSeparatorAppendix ? DECIMAL_SEPARATOR : ""}`
    }

    getSuccessorState(input: CalculatorInput): Term {
        if (DIGITS.includes(input as Digit)) {
            return this.appending(input as Digit);
        } else if (input === DECIMAL_SEPARATOR) {
            return new NumberTerm(this.value, true);
        } else {
            return super.getSuccessorState(input);
        }
    }

    appending(digit: Digit) {
        return new NumberTerm(parseFloat(`${this.value}${this.hasDecimalSeparatorAppendix ? DECIMAL_SEPARATOR : ""}${digit}`))
    }
}

class UnaryOperationTerm extends Term {

    constructor(
        private readonly operator: UnaryOperator,
        private readonly operand: Term
    ) {
        super();
    }

    evaluate(): number {
        const evaluatedOperand = this.operand.evaluate();
        switch (this.operator) {
            case "%":
                return evaluatedOperand / 100
            case "+/-":
                return -1 * evaluatedOperand;
        }
    }

    displayValue(): string {
        return `${this.evaluate()}`
    }

    getSuccessorState(input: CalculatorInput): Term {
        if (DIGITS.includes(input as Digit)) {
            return new NumberTerm(parseFloat(`${this.evaluate()}${input}`))
        } else {
            return super.getSuccessorState(input);
        }
    }
}

class BinaryOperationTerm extends Term {

    constructor(
        private operator: BinaryOperator,
        private lhsOperand: Term,
        private rhsOperand?: Term
    ) {
        super();
    }

    evaluate(): number {
        const evaluatedLhs = this.lhsOperand.evaluate();
        const evaluatedRhs = this.rhsOperand?.evaluate() ?? (["/", "x"].includes(this.operator) ? 1 : 0);
        switch (this.operator) {
            case "/":
                return evaluatedLhs / evaluatedRhs;
            case "+":
                return evaluatedLhs + evaluatedRhs;
            case "-":
                return evaluatedLhs - evaluatedRhs;
            case "x":
                return evaluatedLhs * evaluatedRhs;
        }
    }

    displayValue(): string {
        if (this.rhsOperand) {
            return this.rhsOperand.displayValue()
        } else {
            return `${this.lhsOperand.evaluate()}`;
        }
    }

    getSuccessorState(input: CalculatorInput): Term {
        if (DIGITS.includes(input as Digit)) {
            if (this.rhsOperand) {
                return new BinaryOperationTerm(this.operator, this.lhsOperand, new NumberTerm(parseFloat(`${this.rhsOperand.displayValue()}${input}`)))
            } else {
                return new BinaryOperationTerm(this.operator, this.lhsOperand, new NumberTerm(parseFloat(input)))
            }
        } else {
            return super.getSuccessorState(input);
        }
    }
}

function SophisticatedCalculator() {
    const [term, setTerm] = useState<Term>(new NumberTerm(0));

    console.log(term);

    const buttonLabels = [
        { label: "AC" },
        { label: "+/-" },
        { label: "%" },
        { label: "/" },
        { label: "7" },
        { label: "8" },
        { label: "9" },
        { label: "x" },
        { label: "4" },
        { label: "5" },
        { label: "6" },
        { label: "-" },
        { label: "1" },
        { label: "2" },
        { label: "3" },
        { label: "+" },
        { label: "0" },
        { label: DECIMAL_SEPARATOR },
        { label: "=" },
    ];

  return (
      <Calculator displayValue={term.displayValue()} buttons={buttonLabels.map(({ label }) => ({ label, action: () => setTerm(term.getSuccessorState(label as CalculatorInput))}))} />
  )
}

export default SophisticatedCalculator

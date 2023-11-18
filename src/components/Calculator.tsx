import "./Calculator.css";

export default function Calculator(props: { displayValue: string, buttons: { label: string, action: () => void }[]}) {

    const getColorClass = (label: string) => {
        switch (label) {
            case "AC":
            case "+/-":
            case "%":
                return "light-gray";
            case "/":
            case "x":
            case "-":
            case "+":
            case "=":
                return "orange";
            default:
                return "dark-gray";
        }
    }

    return <div className="calculator">
        <p className="display">{props.displayValue}</p>
        <div className="keyboard">
            {props.buttons.map(({label, action}) => <button className={(label === "0" ? "zero" : "") + " " + getColorClass(label)} key={label} onClick={action}>{label}</button>)}
        </div>
    </div>
}

/* eslint-disable no-console */
import React from "react";
import {render} from "react-dom";

// eslint-disable-next-line func-style
const App: React.FC = function() {
    return <div style={{
        color: "white",
        fontSize: "200px",
    }}>Hi!</div>;
};

render(<App />, document.getElementById("app"));

export default App;

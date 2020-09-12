import h from "../hyperapp-jsx";

import titleTxt from "../../assets/title.txt";

const Main = () => {
  return (
    <main>
      <pre>{titleTxt}</pre>
      <p>
        Click anywhere to continue...{" "}
        <span class="flash animated infinite">|</span>
      </p>
    </main>
  );
};

export default Main;

import h from "../hyperapp-jsx";

import titleTxt from "../../assets/title.txt";

const Main = () => {
  return (
    <main>
      <pre>{titleTxt}</pre>
      <p>
        Press any key to continue...{" "}
        <span class="flash animated infinite">|</span>
      </p>
    </main>
  );
};

export default Main;

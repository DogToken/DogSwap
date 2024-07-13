import React from "react";

import SwitchButton from "./SwitchButton";
import LiquidityDeployer from "./LiquidityDeployer";
import LiquidityRemover from "./RemoveLiquidity";

function Liquidity(props) {

  const [deploy, setDeploy] = React.useState(true);

  const deploy_or_remove = (deploy) => {
    if (deploy === true) {
      return <LiquidityDeployer network={props.network}/>;
    }
    return <LiquidityRemover network={props.network}/>;
  };

  return (
    <div>
      <div>
        <div>
          <h5>
            <SwitchButton setDeploy={setDeploy} />
          </h5>

          {deploy_or_remove(deploy)}
        </div>
      </div>
    </div>
  );
}

export default Liquidity;

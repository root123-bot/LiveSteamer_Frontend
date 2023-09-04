import { motion } from "framer-motion";

function animations() {
  return (
    <div>
      {/* in html/react if y is positive it goes down if its negative it goes up, if you pass x as positive it will move 'right' this animate is just
          like 'transform' css where at first it render your element in given default position then it transform/move it to position you set 
          apart from that you can set 'intial position of your element instead of 'default one' using 'initial' props, using this 'initial' you
          can set 'scale' of element is you want it to be none display initialy you can set 'scale equal to '0' then in animate you can set the 
          scale to be '1' this is just like display 'none' display: 'block' */}
      <motion.div
        // animate={{ y: 100, scale: 1 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={{ width: "300px", height: "300px", background: "black" }}
      ></motion.div>
    </div>
  );
}

export default animations;

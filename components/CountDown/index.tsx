import { useEffect, useState,memo } from 'react';
import styles from './index.module.scss';
interface CountDownProps {
  time: number;
  onEnd: () => void;
}
const CountDown = (props: CountDownProps) => {
  const { time, onEnd } = props;
  const [countDown, setCountDown] = useState(time || 60);
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCountDown((state) => {
        if (state > 0) {
          return state - 1;
        } else {
          clearInterval(timeInterval);
          return state;
        }
      });
    }, 1000);
    return () => {
      clearInterval(timeInterval);
    };
  }, [onEnd, time]);
  useEffect(()=>{
    if (countDown<=0){
      onEnd && onEnd();
    }
  },[countDown,onEnd])
  return <div className={styles.countDown}>{countDown}</div>;
};
export default memo(CountDown);

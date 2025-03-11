import Svg, { Path } from 'react-native-svg';

function ChartIcon({ color }: { color: string }) {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12C2 10.8954 2.89543 10 4 10H6C7.10457 10 8 10.8954 8 12V22H4C2.89543 22 2 21.1046 2 20V12Z"
        fill={color}
      />
      <Path d="M9 4C9 2.89543 9.89543 2 11 2H13C14.1046 2 15 2.89543 15 4V22H9V4Z" fill={color} />
      <Path
        d="M16 8C16 6.89543 16.8954 6 18 6H20C21.1046 6 22 6.89543 22 8V20C22 21.1046 21.1046 22 20 22H16V8Z"
        fill={color}
      />
    </Svg>
  );
}

export default ChartIcon;

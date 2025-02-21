export interface LogoProps {
  readonly size: number;
  readonly fill?: string;
}

export function Logo(props: LogoProps): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style={{ width: props.size, height: props.size }}>
      <title>MDR</title>
      <rect width="175" height="175" fill={props.fill ?? '#ADD8E6'} />
      <text x="87" y="100" fontSize="50" fill="#FFFFFF" textAnchor="middle" fontFamily="Arial, sans-serif">MDR</text>
    </svg>
  );
}

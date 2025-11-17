import styles from './Button.module.css';
type ButtonVariant = 'filled' | 'green-outline' | 'black-outline';


interface ButtonProps {
onClick?: () => void;
title: string;
variant?: ButtonVariant;
disabled?: boolean;
}
export default function Buttons({
onClick,
title,
disabled,
}:
ButtonProps) {
return (
<button
  onClick={onClick}
  className={styles.button}
  disabled={disabled}>
{title}
</button>
);}
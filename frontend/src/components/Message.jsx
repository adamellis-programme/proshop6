import { Alert } from 'react-bootstrap'

const Message = ({ variant = 'info', children }) => {
  // children is what we are wrapping
  //  CHILDREN ARE WHAT IS INBETWEEN THEN <MESSAGAGE> TEXT ETC</MESSAGE/>
  return <Alert variant={variant}>{children}</Alert>
}

// Message.defaultProps = {
//   variant: 'info',
// }

export default Message

// CNTRL I TO AUTO IMPORT

/**
 * MORE MODERN
 * const Message = ({ variant = "info", children }) => {
return
{children}
;
};
 */

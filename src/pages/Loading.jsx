
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import * as React from 'react'

export default function Loading({
  loading = true,
  onClick,
  backdrop = true,
  type = 'circular',
  color = 'primary',
  ...rest
}) {
  const loadingComponent = {
    circular: <CircularProgress color={color} {...rest} />,
  }

  if (!loading) return null

  if (backdrop)
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open
        onClick={onClick}
      >
        {loadingComponent[type]}
      </Backdrop>
    )
  // center loading in the middle of the screen
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%' }}>{loadingComponent[type]}</div>
  )
}
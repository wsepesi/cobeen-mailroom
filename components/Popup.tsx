import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"

import CloseIcon from '@mui/icons-material/Close'

type Props = {
    open: boolean
    handleClose: () => void
    children: React.ReactNode
    title: string
}

const Popup = (props: Props): React.ReactElement => {
    const { open, handleClose, children, title } = props

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={false}>
            <DialogTitle sx={{
                // bold the font, and do space between
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                // center vertically
                alignItems: 'center',
            }}>
                {title}
                {/* IconButton with mui X icon */}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                minWidth: '40vw',
                minHeight: '400px',
            }}>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default Popup
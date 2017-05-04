import React from 'react'
import { colors, borderWeight, borderRadius, spacing } from '../../theme'

const Button = ({ children, onClick }) => (
  <span>
    <span className="button" role="button" onClick={onClick}>{children}</span>
    <style jsx>{`
        .button {
          background: ${colors.primary};
          border: ${borderWeight.normal} solid ${colors.primary};
          border-radius: ${borderRadius.medium};
          padding: ${spacing.medium};
          cursor: pointer;
        }
      `}</style>
  </span>
)

export default Button;

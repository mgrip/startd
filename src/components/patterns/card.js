import React from 'react'
import { colors, borderWeight, borderRadius, spacing } from '../../theme'

const Card = ({ children, onClick }) => (
  <section>
    <section>{children}</section>
    <style jsx>{`
        .button {
          background: ${colors.primary};
          border: ${borderWeight.normal} solid ${colors.primary};
          border-radius: ${borderRadius.medium};
          padding: ${spacing.medium};
          cursor: pointer;
        }
      `}</style>
  </section>
)

export default Card;

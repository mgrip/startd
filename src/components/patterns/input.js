import React from 'react'
import { colors, borderWeight, borderRadius, spacing } from '../../theme'

const Checkbox = ({ children, onClick }) => (
  <section>
  <label for="text-input-1" class="bx--label">Text field label</label>
  <input id="text-input-1" type="text" class="bx--text-input" placeholder="Hint text here" />

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

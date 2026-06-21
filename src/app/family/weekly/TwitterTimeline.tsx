'use client'

import { useEffect } from 'react'

export default function TwitterTimeline() {
  useEffect(() => {
    // Load Twitter widget script
    if (document.getElementById('twitter-wjs')) return
    const s = document.createElement('script')
    s.id = 'twitter-wjs'
    s.src = 'https://platform.twitter.com/widgets.js'
    s.async = true
    s.charset = 'utf-8'
    document.body.appendChild(s)
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      <a
        className="twitter-timeline"
        data-height="650"
        data-dnt="true"
        data-theme="light"
        data-chrome="noheader nofooter noborders transparent"
        href="https://twitter.com/GoKiteAI"
      >
        @GoKiteAI 的最新动态
      </a>
    </div>
  )
}

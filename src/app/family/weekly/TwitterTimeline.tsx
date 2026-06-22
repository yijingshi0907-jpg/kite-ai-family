'use client'

import { useEffect } from 'react'

export default function TwitterTimeline({ account }: { account: string }) {
  useEffect(() => {
    if (document.getElementById('twitter-wjs')) {
      // Script already loaded — re-run widget init for newly added anchors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any
      if (w.twttr?.widgets) w.twttr.widgets.load()
      return
    }
    const s = document.createElement('script')
    s.id = 'twitter-wjs'
    s.src = 'https://platform.twitter.com/widgets.js'
    s.async = true
    s.charset = 'utf-8'
    document.body.appendChild(s)
  }, [account])

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* eslint-disable-next-line react/jsx-no-target-blank */}
      <a
        className="twitter-timeline"
        data-height="600"
        data-dnt="true"
        data-theme="light"
        data-chrome="noheader nofooter noborders transparent"
        href={`https://twitter.com/${account}`}
      >
        @{account} 的最新动态
      </a>
    </div>
  )
}

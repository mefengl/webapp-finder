import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SiGithub } from 'react-icons/si'

function useActiveTabUrl(): string {
  const [url, setUrl] = useState<string>('')
  useEffect(() => {
    const getActiveTabUrl = async () => {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
      if (tab?.url) {
        let formattedUrl = tab.url
        if (formattedUrl.endsWith('/')) {
          formattedUrl = formattedUrl.slice(0, -1)
        }
        setUrl(formattedUrl)
      }
    }
    getActiveTabUrl()
  }, [])
  return url
}

interface Tool {
  applicableSites?: string[]
  description?: string
  name: string
  url: string
}

const tools: Tool[] = [
  // General
  {
    description: 'Compress images with ease',
    name: 'Squoosh',
    url: 'https://squoosh.app',
  },
  {
    description: 'Visual encyclopedia of exercises, muscles, and stretches',
    name: 'MuscleWiki',
    url: 'https://musclewiki.com',
  },
  {
    name: 'Favicon Extractor',
    url: 'https://www.faviconextractor.com',
  },
  {
    name: 'Regexr',
    url: 'https://regexr.com',
  },
  {
    description: 'Identify fonts from images',
    name: 'WhatTheFont',
    url: 'https://www.myfonts.com/pages/whatthefont',
  },
  {
    name: 'SQLite Viewer',
    url: 'https://sqliteviewer.app',
  },
  {
    description: 'Download videos from YouTube, Twitter, Facebook, etc.',
    name: 'SaveFrom.net',
    url: 'https://savefrom.net',
  },
  {
    description: 'Every tool you could want to edit images in bulk',
    name: 'iLoveIMG',
    url: 'https://www.iloveimg.com',
  },
  {
    description: 'Create avatars for your profiles, designs, websites or apps. Piece by piece or based on a seed.',
    name: 'DiceBear',
    url: 'https://editor.dicebear.com',
  },
  // Site-specific
  {
    applicableSites: ['youtube.com'],
    name: 'Get YouTube Thumbnail',
    url: 'https://youtube-thumbnail-grabber.com',
  },
  {
    applicableSites: ['youtube.com'],
    name: 'YouTube Downloader',
    url: 'https://yt1s.com',
  },
  {
    applicableSites: ['ui.shadcn.com'],
    description: 'Customize shadcn/ui themes',
    name: 'shadcn/ui customizer',
    url: 'https://customizer.railly.dev',
  },
  {
    applicableSites: ['github.com'],
    name: 'Repo to Text',
    url: 'https://repo2txt.simplebasedomain.com',
  },
  {
    applicableSites: ['framer.com/motion'],
    name: 'Framer Ground',
    url: 'https://ground.bossadizenith.me',
  },
]

function ToolItem({ tool }: { tool: Tool }) {
  return (
    <div
      className="group relative cursor-pointer rounded-lg border p-4 transition-all hover:border-blue-500 hover:shadow-md"
      onClick={() => window.open(tool.url, '_blank')}
    >
      <div className="block text-lg font-medium text-blue-600 group-hover:text-blue-700">
        {tool.name}
      </div>
      {tool.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{tool.description}</p>
      )}
      {tool.applicableSites && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tool.applicableSites.map(site => (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700" key={site}>
              {site}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function Popup() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const url = useActiveTabUrl()

  const { matchedTools, unmatchedTools } = useMemo(() => {
    const filtered = tools.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase())
        || (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesSearch
    })

    return filtered.reduce(
      (acc, tool) => {
        const isMatched = tool.applicableSites?.some(site => url.includes(site)) || false
        if (isMatched) {
          acc.matchedTools.push(tool)
        }
        else {
          acc.unmatchedTools.push(tool)
        }
        return acc
      },
      { matchedTools: [], unmatchedTools: [] } as { matchedTools: Tool[], unmatchedTools: Tool[] },
    )
  }, [searchTerm, url])

  return (
    <Card className="flex h-[600px] w-[800px] flex-col overflow-hidden rounded-none">
      <CardHeader className="pb-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="pl-8 transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search tools..."
            type="text"
            value={searchTerm}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ScrollArea className="h-[400px]">
          <div className="space-y-6 p-4">
            {matchedTools.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">Matched Tools</h3>
                <div className="grid grid-cols-2 gap-4">
                  {matchedTools.map(tool => (
                    <ToolItem key={tool.name} tool={tool} />
                  ))}
                </div>
              </div>
            )}
            {unmatchedTools.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {matchedTools.length > 0 ? 'Other Tools' : 'All Tools'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {unmatchedTools.map(tool => (
                    <ToolItem key={tool.name} tool={tool} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => window.open('https://github.com/mefengl/unextension/issues/new', '_blank')}
          variant="outline"
        >
          <SiGithub className="mr-2 size-4" />
          Suggest a Tool
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="text-gray-500"
              variant="link"
            >
              About
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About</DialogTitle>
              <DialogDescription>
                <div className="mb-4 text-sm text-gray-700">
                  Made by
                  {' '}
                  <a className="underline" href="https://x.com/mefengl" rel="noopener noreferrer" target="_blank">Alan</a>
                  {' '}
                  😎
                </div>
                <div className="mb-4 text-xs text-gray-500">
                  Credits:
                  <br />
                  Logo based on `mage:inbox-star-fill` from
                  {' '}
                  <a className="underline" href="https://github.com/Mage-Icons/mage-icons" rel="noopener noreferrer" target="_blank">Mage Icons</a>
                  , licensed under the
                  {' '}
                  <a className="underline" href="https://www.apache.org/licenses/LICENSE-2.0" rel="noopener noreferrer" target="_blank">Apache 2.0</a>
                  {' '}
                  license.
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

export default Popup

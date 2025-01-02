import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PlusCircle, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SiGithub } from 'react-icons/si'

import type { UserTool } from './storage'

import { userTools } from './storage'

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
  category?: string
  name: string
  url: string
}

const tools: Tool[] = [
  // General - Sorted by Frequency
  {
    category: 'General',
    name: 'Universal Video Downloader',
    url: 'https://savefrom.net',
  },
  {
    category: 'General',
    name: 'Movie Subtitle Finder',
    url: 'https://www.subtitlecat.com',
  },
  {
    category: 'General',
    name: 'Image Compression Tool',
    url: 'https://squoosh.app',
  },
  {
    category: 'General',
    name: 'PDF Editor & Converter',
    url: 'https://www.sejda.com',
  },
  {
    category: 'General',
    name: 'Bulk Image Editor',
    url: 'https://www.iloveimg.com',
  },
  {
    category: 'General',
    name: 'Regex Tester & Debugger',
    url: 'https://regexr.com',
  },
  {
    category: 'General',
    name: 'Online Audio Editor',
    url: 'https://mp3cut.net',
  },
  {
    category: 'General',
    name: 'SQLite Browser Online',
    url: 'https://sqliteviewer.app',
  },
  {
    category: 'General',
    name: 'Website Icon Extractor',
    url: 'https://www.faviconextractor.com',
  },
  {
    category: 'General',
    name: 'Font Identifier Tool',
    url: 'https://www.myfonts.com/pages/whatthefont',
  },
  {
    category: 'General',
    name: 'Avatar Generator API',
    url: 'https://editor.dicebear.com',
  },
  {
    category: 'General',
    name: '3D Exercise Guide',
    url: 'https://musclewiki.com',
  },
  {
    category: 'General',
    name: 'Tailwind CSS Reference',
    url: 'https://umeshmk.github.io/Tailwindcss-cheatsheet/',
  },
  {
    category: 'General',
    name: 'HD Movie Download Hub',
    url: 'https://yts.mx',
  },
  {
    category: 'General',
    name: 'Browser Torrent Streamer',
    url: 'https://webtor.io',
  },
  {
    category: 'General',
    name: 'Cobalt Media Downloader',
    url: 'https://cobalt.tools/',
  },
  // Grouped by platform/site
  {
    applicableSites: ['youtube.com'],
    category: 'YouTube', // Changed from Site-specific
    name: 'Video Grabber',
    url: 'https://yt1s.com',
  },
  {
    applicableSites: ['youtube.com'],
    category: 'YouTube', // Changed from Site-specific
    name: 'Thumbnail Finder',
    url: 'https://youtube-thumbnail-grabber.com',
  },
  {
    applicableSites: ['github.com'],
    category: 'GitHub', // Changed from Site-specific
    name: 'Repo Extractor',
    url: 'https://repo2txt.simplebasedomain.com',
  },
  {
    applicableSites: ['ui.shadcn.com'],
    category: 'Shadcn', // Changed from Site-specific
    name: 'Theme Designer',
    url: 'https://customizer.railly.dev',
  },
  {
    applicableSites: ['framer.com/motion'],
    category: 'Framer', // Changed from Site-specific
    name: 'Motion Playground',
    url: 'https://ground.bossadizenith.me',
  },
]

function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    return domain
  }
  catch {
    return ''
  }
}

function ToolItem({ tool }: { tool: Tool }) {
  return (
    <div
      className="flex cursor-pointer items-center justify-between border-b px-3 py-2 hover:bg-gray-50"
      onClick={() => window.open(tool.url, '_blank')}
    >
      <span className="text-sm text-gray-900">{tool.name}</span>
      <span className="text-xs text-gray-500">{extractDomain(tool.url)}</span>
    </div>
  )
}

function AddToolDialog({ url }: { url: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = async () => {
    const tools = await userTools.getValue()
    await userTools.setValue([...tools, { category, name, url }])
    setIsOpen(false)
    setName('')
    setCategory('')
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircle className="mr-1 size-3" />
          Add Current Site
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tool</DialogTitle>
          <DialogDescription>
            Add current site as a tool
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              onChange={e => setName(e.target.value)}
              placeholder="Tool name"
              value={name}
            />
            <Input
              onChange={e => setCategory(e.target.value)}
              placeholder="Category (optional)"
              value={category}
            />
          </div>
          <Button disabled={!name} onClick={handleSubmit}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Popup() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const url = useActiveTabUrl()
  const [userDefinedTools, setUserDefinedTools] = useState<UserTool[]>([])

  useEffect(() => {
    userTools.getValue().then(setUserDefinedTools)
    return userTools.watch((tools) => {
      setUserDefinedTools(tools)
    })
  }, [])

  const groupedTools = useMemo(() => {
    const allTools = [
      ...tools,
      ...userDefinedTools.map(t => ({ ...t, isUserDefined: true })),
    ]

    const filtered = allTools.filter((tool) => {
      if (!searchTerm)
        return true
      const searchTermLower = searchTerm.toLowerCase()
      return (
        tool.name.toLowerCase().includes(searchTermLower)
        || tool.url.toLowerCase().includes(searchTermLower)
        || tool.category?.toLowerCase().includes(searchTermLower)
        || extractDomain(tool.url).toLowerCase().includes(searchTermLower)
      )
    })

    return filtered.reduce((acc, tool) => {
      const category = tool.applicableSites?.some(site => url.includes(site))
        ? 'Matched Tools'
        : (tool.category || 'Other')
      if (!acc[category])
        acc[category] = []
      acc[category].push(tool)
      return acc
    }, {} as Record<string, Tool[]>)
  }, [searchTerm, url, userDefinedTools])

  return (
    <div className="flex size-[600px] flex-col">
      <div className="border-b px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1.5 size-4 text-gray-400" />
            <Input
              className="h-8 border-0 pl-8 ring-1 ring-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search tools..."
              type="text"
              value={searchTerm}
            />
          </div>
          <AddToolDialog url={url} />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {Object.entries(groupedTools).map(([category, items]) => (
          <div key={category}>
            <div className="sticky top-0 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
              {category}
            </div>
            <div className="grid grid-cols-2 divide-x">
              {items.map(tool => (
                <ToolItem key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t px-3 py-2">
        <Button
          onClick={() => window.open('https://github.com/mefengl/webapp-finder/issues/new', '_blank')}
          size="sm"
          variant="outline"
        >
          <SiGithub className="mr-1 size-3" />
          Suggest
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
                  Logo from
                  {' '}
                  <a className="underline" href="https://heyzoish.gumroad.com/l/notionists" rel="noopener noreferrer" target="_blank">Notionists</a>
                  {' '}
                  by
                  {' '}
                  <a className="underline" href="https://bio.link/heyzoish" rel="noopener noreferrer" target="_blank">Zoish</a>
                  , licensed under
                  {' '}
                  <a className="underline" href="https://creativecommons.org/publicdomain/zero/1.0/" rel="noopener noreferrer" target="_blank">CC0 1.0</a>
                  . Remix of the original.
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Popup

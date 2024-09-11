import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Separator } from '@/components/ui/separator'
import { Search, Tag } from 'lucide-react'
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
    name: 'Get Favicon',
    url: 'http://www.getfavicon.org/',
  },
  // Site-specific
  {
    applicableSites: ['youtube.com'],
    name: 'Get YouTube Thumbnail',
    url: 'https://youtube-thumbnail-grabber.com',
  },
  {
    applicableSites: ['ui.shadcn.com'],
    description: 'Customize shadcn/ui themes',
    name: 'shadcn/ui customizer',
    url: 'https://customizer.railly.dev',
  },
]

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

  function ToolItem({ tool }: { tool: Tool }) {
    return (
      <div className="mb-2 last:mb-0">
        <div className="flex items-center gap-2 text-lg">
          <a
            className="text-blue-500 underline"
            href={tool.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {tool.name}
          </a>
          {tool.description && (
            <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="flex h-[600px] w-[800px] flex-col overflow-hidden rounded-none">
      <CardHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="pl-8"
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search tools..."
            type="text"
            value={searchTerm}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4">
            {matchedTools.length > 0 && (
              <>
                <h3 className="mb-2 font-semibold">Matched Tools</h3>
                {matchedTools.map(tool => (
                  <ToolItem key={tool.name} tool={tool} />
                ))}
              </>
            )}
            {matchedTools.length > 0 && unmatchedTools.length > 0 && (
              <Separator className="my-4" />
            )}
            {unmatchedTools.length > 0 && (
              <>
                {matchedTools.length > 0 && (
                  <h3 className="mb-2 font-semibold">Other Tools</h3>
                )}
                {unmatchedTools.map(tool => (
                  <ToolItem key={tool.name} tool={tool} />
                ))}
              </>
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

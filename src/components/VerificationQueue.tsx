'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

interface VerificationItem {
  id: number;
  projectName: string;
  submittedBy: string;
  status: string;
  date: string;
}

export default function VerificationQueue() {
  const [queue, setQueue] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQueue = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await fetch('/api/admin/verification-queue', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Could not fetch verification queue.');
        }
        setQueue(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [token, toast]);
  
  if (loading) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Verification Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>Projects Awaiting Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead className="hidden md:table-cell">Submitted By</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queue.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.projectName}</TableCell>
                <TableCell className="hidden md:table-cell">{item.submittedBy}</TableCell>
                <TableCell className="hidden sm:table-cell">{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-accent-yellow/20 text-accent-yellow border-accent-yellow">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" className="text-primary-green hover:bg-primary-green/10 hover:text-primary-green">
                        <Check className="h-4 w-4"/>
                        <span className="sr-only">Approve</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <X className="h-4 w-4"/>
                        <span className="sr-only">Reject</span>
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

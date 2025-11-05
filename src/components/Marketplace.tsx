'use client';

import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, MapPin, Tag, Globe } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  tons: number;
  pricePerTon: number;
  type: string;
  location: string;
}

export default function Marketplace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Could not fetch projects.';
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token, toast]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-md rounded-lg">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col justify-between shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold text-text-primary">{project.name}</CardTitle>
              <Badge variant="outline" className="text-primary-green border-primary-green">{`$${project.pricePerTon}/ton`}</Badge>
            </div>
            <CardDescription className="flex items-center text-text-secondary pt-1">
              <MapPin className="w-4 h-4 mr-1.5" />
              {project.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
                <div className="flex items-center text-text-secondary">
                    <Briefcase className="w-4 h-4 mr-2 text-primary"/>
                    <span className="font-semibold text-text-primary mr-2">{project.tons.toLocaleString()} tons</span> available
                </div>
                <div className="flex items-center text-text-secondary">
                    <Tag className="w-4 h-4 mr-2 text-primary"/>
                    Project Type: <span className="font-semibold text-text-primary ml-1">{project.type}</span> 
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-primary-green hover:bg-primary-green/90 text-white rounded-lg">Buy Credits</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { DeploymentType, WebDeploymentStatus, AppStoreDeploymentStatus } from '../types';
import { GithubIcon } from './icons/GithubIcon';
import { AppleIcon } from './icons/AppleIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface DeploymentModalProps {
  type: DeploymentType;
  onClose: () => void;
}

const WebDeploymentFlow: React.FC<{onClose: () => void}> = ({onClose}) => {
    const [status, setStatus] = useState<WebDeploymentStatus>(WebDeploymentStatus.IDLE);
    const [url, setUrl] = useState('');

    useEffect(() => {
        const statuses = [
            WebDeploymentStatus.CONNECTING_GITHUB,
            WebDeploymentStatus.PUBLISHING_VERCEL,
            WebDeploymentStatus.SUCCESS,
        ];
        let currentStatusIndex = 0;
        
        const timer = setInterval(() => {
            if (currentStatusIndex < statuses.length) {
                setStatus(statuses[currentStatusIndex]);
                if (statuses[currentStatusIndex] === WebDeploymentStatus.SUCCESS) {
                    setUrl(`https://vibe-code-${Date.now().toString(36)}.vercel.app`);
                }
                currentStatusIndex++;
            } else {
                clearInterval(timer);
            }
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    const getStatusContent = () => {
        switch (status) {
            case WebDeploymentStatus.CONNECTING_GITHUB:
                return <><SpinnerIcon /><span>Connecting to GitHub...</span></>;
            case WebDeploymentStatus.PUBLISHING_VERCEL:
                return <><SpinnerIcon /><span>Creating Vercel project...</span></>;
            case WebDeploymentStatus.SUCCESS:
                return <><span className="text-green-400">✅</span><span>Deployment successful!</span></>;
            default:
                return <><SpinnerIcon /><span>Starting...</span></>;
        }
    };
    
    return (
        <div>
            <div className="flex items-center gap-3 mb-6"><GithubIcon /><h3 className="text-xl font-bold">Publish to Web</h3></div>
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">{getStatusContent()}</div>
                {status === WebDeploymentStatus.SUCCESS && (
                    <div className="p-4 bg-gray-800 border border-green-500/30 rounded-lg">
                        <p className="text-gray-300 text-sm mb-1">Your app is live at:</p>
                        <a href={`https://${url}`} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline break-all">{url}</a>
                    </div>
                )}
            </div>
             <button onClick={onClose} className="mt-6 w-full bg-cyan-500 text-white font-semibold py-2 rounded-lg hover:bg-cyan-600 transition">Close</button>
        </div>
    );
};


const AppStoreDeploymentFlow: React.FC<{onClose: () => void}> = ({onClose}) => {
    const [status, setStatus] = useState<AppStoreDeploymentStatus>(AppStoreDeploymentStatus.CREDENTIALS);

    useEffect(() => {
        if(status === AppStoreDeploymentStatus.CREDENTIALS) return;

        const statuses = [
            AppStoreDeploymentStatus.QUEUED,
            AppStoreDeploymentStatus.BUILDING,
            AppStoreDeploymentStatus.DOWNLOADING,
            AppStoreDeploymentStatus.UPLOADING,
            AppStoreDeploymentStatus.SUCCESS,
        ];
        let currentStatusIndex = 0;
        const timer = setInterval(() => {
            if (currentStatusIndex < statuses.length) {
                setStatus(statuses[currentStatusIndex]);
                currentStatusIndex++;
            } else {
                clearInterval(timer);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [status]);
    
    const statusMessages = {
        [AppStoreDeploymentStatus.QUEUED]: "Job Queued...",
        [AppStoreDeploymentStatus.BUILDING]: "Building with EAS...",
        [AppStoreDeploymentStatus.DOWNLOADING]: "Downloading .ipa artifact...",
        [AppStoreDeploymentStatus.UPLOADING]: "Uploading to App Store Connect...",
        [AppStoreDeploymentStatus.SUCCESS]: "Deployment complete!",
    };
    
    if (status === AppStoreDeploymentStatus.CREDENTIALS) {
        return (
             <div>
                <div className="flex items-center gap-3 mb-6"><AppleIcon /><h3 className="text-xl font-bold">Deploy to App Store</h3></div>
                <form onSubmit={(e) => { e.preventDefault(); setStatus(AppStoreDeploymentStatus.QUEUED); }}>
                    <p className="text-sm text-gray-400 mb-4">Securely provide your credentials to start the deployment. These will be encrypted and are not stored.</p>
                    <div className="space-y-4">
                        <input type="text" placeholder="Expo Access Token" className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600" />
                        <input type="text" placeholder="App Store Connect API Key ID" className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600" />
                         <input type="text" placeholder="App Store Connect Issuer ID" className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600" />
                        <textarea placeholder="App Store Connect Private Key" className="w-full bg-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-600" rows={3}></textarea>
                    </div>
                    <button type="submit" className="mt-6 w-full bg-cyan-500 text-white font-semibold py-2 rounded-lg hover:bg-cyan-600 transition">Start Deployment</button>
                </form>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center gap-3 mb-6"><AppleIcon /><h3 className="text-xl font-bold">Deploying to App Store</h3></div>
            <div className="space-y-3">
            {Object.entries(statusMessages).map(([key, message]) => {
                const statusKey = Number(key) as AppStoreDeploymentStatus;
                const isDone = status >= statusKey;
                const isActive = status === statusKey;
                return (
                    <div key={key} className={`flex items-center gap-3 p-3 rounded-lg transition ${isDone ? 'bg-gray-800 border-gray-700' : 'bg-gray-800/50 text-gray-500 border-gray-800'} border`}>
                        {isActive ? <SpinnerIcon /> : isDone ? <span className="text-green-400">✅</span> : '⏳'}
                        <span>{message}</span>
                    </div>
                );
            })}
            </div>
             <button onClick={onClose} className="mt-6 w-full bg-cyan-500 text-white font-semibold py-2 rounded-lg hover:bg-cyan-600 transition">
                {status === AppStoreDeploymentStatus.SUCCESS ? 'Finish' : 'Close'}
            </button>
        </div>
    );
};


export const DeploymentModal: React.FC<DeploymentModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div 
        className="relative bg-gray-900/80 text-gray-200 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-700" 
        onClick={(e) => e.stopPropagation()}
      >
        {type === DeploymentType.WEB && <WebDeploymentFlow onClose={onClose} />}
        {type === DeploymentType.APP_STORE && <AppStoreDeploymentFlow onClose={onClose} />}
      </div>
    </div>
  );
};
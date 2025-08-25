from sklearn.cluster import KMeans
import pandas as pd
import matplotlib.pyplot as plt

# ✅ Always read uploaded CSV as data.csv
df = pd.read_csv('data.csv')
X = df[['x','y']].values

model = KMeans(n_clusters=2, n_init=10).fit(X)

plt.scatter(X[:,0], X[:,1], c=model.labels_, cmap='viridis')
plt.scatter(model.cluster_centers_[:,0], model.cluster_centers_[:,1], c='red', marker='x')
plt.title('K-Means Clustering (from CSV)')
plt.savefig('output.png')

print('Cluster centers:', model.cluster_centers_)

df['cluster'] = model.labels_
df.to_csv('clustered.csv', index=False)